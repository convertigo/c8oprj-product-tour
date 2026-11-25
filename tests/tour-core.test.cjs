// node --test tests/
// Pure helpers of the tour engine (the <tour-core> block of the SetupTour shared action), run under Node.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const yaml = fs.readFileSync(path.join(__dirname, '../_c8oProject/mobileSharedActions/SetupTour.yaml'), 'utf8');

function loadCore() {
	const start = yaml.indexOf('// <tour-core>');
	const end = yaml.indexOf('// </tour-core>');
	assert.ok(start > 0 && end > start, 'the <tour-core> block of SetupTour');
	const indent = yaml.slice(yaml.lastIndexOf('\n', start) + 1, start);
	const source = yaml.slice(start, end)
		.split('\n').map((line) => (line.startsWith(indent) ? line.slice(indent.length) : line.trimStart())).join('\n')
		.replace(/''/g, "'")
		// the TypeScript annotations the block uses
		.replace(/(\w)\??: (?:any|boolean|number|string|void)(?:\[\])?(?=\s*[,)=;])/g, '$1')
		.replace(/\): (?:any|boolean|number|string|void)(?:\[\])? \{/g, ') {');
	return new Function(source + '\nreturn tourCore;')();
}

const core = loadCore();

function memoryStorage(initial) {
	const data = Object.assign({}, initial);
	return {
		getItem: (key) => (key in data ? data[key] : null),
		setItem: (key, value) => { data[key] = String(value); },
		data
	};
}

const tour = {
	id: 'start',
	version: 2,
	steps: [
		{ id: 'welcome', intro: true },
		{ id: 'create', advanceOn: { route: '^/editor/' } },
		{ id: 'open', branch: true },
		{ id: 'admin', when: 'admin' },
		{ id: 'palette' },
		{ id: 'end', when: '!pwa' }
	]
};

test('only relative JSON paths of the application are accepted as tours files', () => {
	assert.equal(core.safePath('assets/tours/tours.json'), true);
	assert.equal(core.safePath('./assets/tours.json'), true);
	for (const path of ['https://raw.githubusercontent.com/x/tours.json', '//other.example/tours.json', 'javascript:void(0).json',
		'../other/tours.json', 'assets/../../tours.json', 'assets/tours.js', 'assets/tours.json?x=1', '', null, 42]) {
		assert.equal(core.safePath(path), false, String(path));
	}
});

test('routes are regular expressions, a missing route matches every URL, a bad one matches none', () => {
	assert.equal(core.matches('^/editor/', '/editor/123'), true);
	assert.equal(core.matches('^/editor/', '/selector/false'), false);
	assert.equal(core.matches(['^/viewer/', '^/editor/'], '/editor/1'), true);
	assert.equal(core.matches(undefined, '/any'), true);
	assert.equal(core.matches('', '/any'), true);
	assert.equal(core.matches('([', '/any'), false);
});

test('conditions are booleans or functions, "!" negates, a throwing condition is false', () => {
	const conditions = { admin: () => true, pwa: false, broken: () => { throw new Error('x'); } };
	assert.equal(core.allowed({ when: 'admin' }, conditions), true);
	assert.equal(core.allowed({ when: '!pwa' }, conditions), true);
	assert.equal(core.allowed({ when: ['admin', 'pwa'] }, conditions), false);
	assert.equal(core.allowed({ when: 'broken' }, conditions), false);
	assert.equal(core.allowed({ when: 'unknown' }, conditions), false);
	assert.equal(core.allowed({}, conditions), true);
});

test('the progress counts the allowed steps, without the branch steps', () => {
	const notAdmin = { admin: false, pwa: false };
	assert.deepEqual(core.counted(tour, notAdmin).map((s) => s.id), ['welcome', 'create', 'palette', 'end']);
	assert.deepEqual(core.progress(tour, 0, notAdmin), { current: 1, total: 4 });
	assert.deepEqual(core.progress(tour, 4, notAdmin), { current: 3, total: 4 });
	// a branch step shows the position of the step it comes from
	assert.deepEqual(core.progress(tour, 2, notAdmin), { current: 2, total: 4 });
	assert.deepEqual(core.progress(tour, 4, { admin: true, pwa: true }), { current: 4, total: 4 });
	// the steps passed or to be passed because their element is absent leave the count
	assert.deepEqual(core.progress(tour, 4, notAdmin, ['create']), { current: 2, total: 3 });
	assert.deepEqual(core.progress(tour, 4, notAdmin, ['end']), { current: 3, total: 3 });
	// the step shown always counts, even if it was once skipped (Back)
	assert.deepEqual(core.progress(tour, 1, notAdmin, ['create']), { current: 2, total: 4 });
});

test('walking skips the branch steps and the steps whose conditions do not hold', () => {
	const notAdmin = { admin: false, pwa: false };
	assert.equal(core.nextIndex(tour, -1, 1, notAdmin), 0);
	assert.equal(core.nextIndex(tour, 1, 1, notAdmin), 4);
	assert.equal(core.nextIndex(tour, 4, -1, notAdmin), 1);
	assert.equal(core.nextIndex(tour, 5, 1, notAdmin), -1);
	assert.equal(core.nextIndex(tour, 4, 1, { admin: false, pwa: true }), -1);
	assert.equal(core.indexOf(tour, 'open'), 2);
	assert.equal(core.indexOf(tour, 'nope'), -1);
});

test('a step marked "count": false is walked through but not counted', () => {
	const t = { steps: [{ id: 'a' }, { id: 'tab', count: false }, { id: 'b' }] };
	assert.deepEqual(core.counted(t, {}).map((s) => s.id), ['a', 'b']);
	assert.equal(core.nextIndex(t, 0, 1, {}), 1);
	assert.deepEqual(core.progress(t, 1, {}), { current: 1, total: 2 });
	assert.deepEqual(core.progress(t, 2, {}), { current: 2, total: 2 });
});

test('the tour of a screen is the first allowed tour whose routes match', () => {
	const defs = { tours: [
		{ id: 'admin', routes: ['^/admin/'], when: 'admin' },
		{ id: 'editor', routes: ['^/editor/'] },
		{ id: 'start', routes: ['^/selector'] },
		{ id: 'data' }
	] };
	assert.equal(core.tourFor(defs, '/editor/12', {}).id, 'editor');
	assert.equal(core.tourFor(defs, '/admin/dashboard', { admin: false }), null);
	assert.equal(core.tourFor(defs, '/admin/dashboard', { admin: true }).id, 'admin');
	assert.equal(core.tourFor(defs, '/settings', {}), null);
	assert.equal(core.find(defs, 'data').id, 'data');
	// "@current": the tour of the screen, else the default tour
	const withDefault = { tours: defs.tours.concat([{ id: 'start2', default: true }]) };
	assert.equal(core.currentTour(withDefault, '/editor/1', {}).id, 'editor');
	assert.equal(core.currentTour(withDefault, '/settings', {}).id, 'start2');
	assert.equal(core.currentTour(defs, '/settings', {}), null);
	// a step of another screen pauses its tour, unless it (or its tour) skips it
	assert.equal(core.skipsOffRoute({}, {}), false);
	assert.equal(core.skipsOffRoute({ offRoute: 'skip' }, {}), true);
	assert.equal(core.skipsOffRoute({ offRoute: 'skip' }, { offRoute: 'pause' }), false);
	assert.equal(core.skipsOffRoute({}, { offRoute: 'skip' }), true);
	assert.equal(core.find(null, 'data'), null);
});

test('a tour is seen once completed or skipped, until a newer version of it', () => {
	const storage = memoryStorage();
	let state = core.readState(storage, 'k');
	assert.deepEqual(state, {});
	assert.equal(core.seen(state, tour), null);
	core.mark(state, tour, 'completed');
	core.writeState(storage, 'k', state);
	state = core.readState(storage, 'k');
	assert.equal(core.seen(state, tour).how, 'completed');
	assert.equal(core.seen(state, Object.assign({}, tour, { version: 3 })), null);
	core.forget(state, 'start');
	assert.equal(core.seen(state, tour), null);
	core.mark(state, tour, 'skipped');
	core.forget(state);
	assert.deepEqual(state.done, {});
});

test('a broken or foreign saved state is read as empty, a full storage does not throw', () => {
	assert.deepEqual(core.readState(memoryStorage({ k: '{oops' }), 'k'), {});
	assert.deepEqual(core.readState(memoryStorage({ k: '[1,2]' }), 'k'), {});
	assert.deepEqual(core.readState(null, 'k'), {});
	assert.doesNotThrow(() => core.writeState({ setItem: () => { throw new Error('quota'); } }, 'k', {}));
});

test('texts are translated keys or plain texts, with {{ }} parameters', () => {
	const dict = { tour_progress: 'Étape {{current}} sur {{total}}', tour_next: 'Suivant' };
	const translate = (key) => (key in dict ? dict[key] : key);
	assert.equal(core.text('tour_next', translate), 'Suivant');
	assert.equal(core.text('Plain text', translate), 'Plain text');
	assert.equal(core.text('tour_progress', translate, { current: 2, total: 9 }), 'Étape 2 sur 9');
	assert.equal(core.text(null, translate), '');
	assert.equal(core.text('tour_next', () => { throw new Error('x'); }), 'tour_next');
});

test('labels come from the i18n keys of the tours file, English otherwise', () => {
	const defs = { labels: { next: 'tour_next', skip: 'tour_skip' } };
	const translate = (key) => ({ tour_next: 'Suivant' })[key] || key;
	assert.equal(core.label(defs, 'next', translate), 'Suivant');
	assert.equal(core.label(defs, 'skip', translate), 'Skip tour');
	assert.equal(core.label(null, 'progress', translate, { current: 1, total: 3 }), 'Step 1 of 3');
	assert.equal(core.label(defs, 'steps', translate, { total: 9 }), '9 steps');
});

test('texts are escaped before they reach the popover, line breaks are kept', () => {
	assert.equal(core.escape('<b class="note">1 < 2</b>'), '&lt;b class=&quot;note&quot;&gt;1 &lt; 2&lt;/b&gt;');
	assert.equal(core.escape("l'aperçu & la suite\nligne 2"), 'l&#39;aperçu &amp; la suite<br>ligne 2');
});

test('anchors become data-tour selectors, anything else is dropped', () => {
	assert.equal(core.anchorSelector('create-app'), '[data-tour~="create-app"]');
	assert.equal(core.anchorSelector(['a', 'b_2']), '[data-tour~="a"], [data-tour~="b_2"]');
	assert.equal(core.anchorSelector('x"] , body [y'), '');
	assert.equal(core.anchorSelector(['ok', '.class123']), '[data-tour~="ok"]');
});

test('every tour of the demo application is valid', () => {
	const defs = JSON.parse(fs.readFileSync(path.join(__dirname, '../DisplayObjects/mobile/assets/tours/tours.json'), 'utf8'));
	const pageYaml = fs.readFileSync(path.join(__dirname, '../_c8oProject/mobilePages/Page.yaml'), 'utf8');
	for (const t of defs.tours) {
		const ids = new Set();
		for (const step of t.steps) {
			assert.ok(step.id && !ids.has(step.id), `${t.id}: unique step id ${step.id}`);
			ids.add(step.id);
			if (step.anchor) {
				assert.match(pageYaml, new RegExp(`MobileSmartSourceType: plain:${step.anchor}\\b`), `anchor ${step.anchor}`);
			}
		}
	}
});

test('the overlay and the popover show without the fade-in of driver.js', () => {
	// In Firefox the end of that opacity animation may never reach the screen while the window keeps the focus: the
	// page was blocked by the tour (body.driver-active) with nothing visible until a resize or a focus change.
	const start = yaml.indexOf('const STYLE = `');
	assert.ok(start > 0, 'the stylesheet of SetupTour');
	const style = yaml.slice(start, yaml.indexOf('`;', start)).replace(/\/\*[\s\S]*?\*\//g, '');
	const rules = [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selectors: m[1].split(',').map((s) => s.trim()), body: m[2] }));
	for (const selector of ['.driver-fade .driver-overlay', '.driver-fade .driver-popover']) {
		const rule = rules.find((r) => r.selectors.includes(selector));
		assert.ok(rule, `a rule for ${selector}`);
		assert.match(rule.body, /animation:\s*none\s*!important/, `${selector} has no animation`);
	}
});
