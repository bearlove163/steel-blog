const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/youdao_style.json', 'utf8'));

const newTerms = [
  {word: 'Pavement', phonetic: '[peivment]', trans: '路面', pos: 'n.', category: '道路', bilingual_examples: [{en: 'The pavement design follows standard specs.', zh: '路面设计遵循标准规范。'}], difficulty: 1, tags: ['道路']},
  {word: 'Subgrade', phonetic: '[sabgreid]', trans: '路基', pos: 'n.', category: '道路', bilingual_examples: [{en: 'Subgrade must be compacted properly.', zh: '路基必须正确压实。'}], difficulty: 1, tags: ['道路']},
  {word: 'Embankment', phonetic: '[imbankment]', trans: '路堤', pos: 'n.', category: '道路', bilingual_examples: [{en: 'The embankment height is 5 meters.', zh: '路堤高度为5米。'}], difficulty: 2, tags: ['道路']},
  {word: 'Culvert', phonetic: '[kalvat]', trans: '涵洞', pos: 'n.', category: '道路', bilingual_examples: [{en: 'Culvert diameter is 1.5 meters.', zh: '涵洞直径为1.5米。'}], difficulty: 2, tags: ['道路']},
  {word: 'Asphalt Concrete', phonetic: '[asfault konkri:t]', trans: '沥青混凝土', pos: 'n.', category: '道路', bilingual_examples: [{en: 'Asphalt concrete is used for pavement.', zh: '沥青混凝土用于路面。'}], difficulty: 2, tags: ['道路']},
  {word: 'Base Course', phonetic: '[beis ko:s]', trans: '基层', pos: 'n.', category: '道路', bilingual_examples: [{en: 'Base course provides structural support.', zh: '基层提供结构支撑。'}], difficulty: 2, tags: ['道路']},
  {word: 'Subbase', phonetic: '[sabbeis]', trans: '底基层', pos: 'n.', category: '道路', bilingual_examples: [{en: 'Subbase layer is 20cm thick.', zh: '底基层厚度为20厘米。'}], difficulty: 2, tags: ['道路']},
  {word: 'Guardrail', phonetic: '[ga:dreil]', trans: '护栏', pos: 'n.', category: '道路', bilingual_examples: [{en: 'Guardrail prevents vehicle accidents.', zh: '护栏防止车辆事故。'}], difficulty: 1, tags: ['道路']},
  {word: 'Bridge Deck', phonetic: '[bridj dek]', trans: '桥面板', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Bridge deck carries traffic load.', zh: '桥面板承受交通荷载。'}], difficulty: 2, tags: ['桥梁']},
  {word: 'Pier', phonetic: '[pie]', trans: '桥墩', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Pier supports the bridge superstructure.', zh: '桥墩支撑桥梁上部结构。'}], difficulty: 1, tags: ['桥梁']},
  {word: 'Abutment', phonetic: '[abattment]', trans: '桥台', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Abutment resists lateral forces.', zh: '桥台抵抗侧向力。'}], difficulty: 2, tags: ['桥梁']},
  {word: 'Span', phonetic: '[span]', trans: '跨度', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'The main span is 200 meters.', zh: '主跨为200米。'}], difficulty: 1, tags: ['桥梁']},
  {word: 'Arch Bridge', phonetic: '[a:tch bridj]', trans: '拱桥', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Arch bridge has beautiful appearance.', zh: '拱桥外观优美。'}], difficulty: 1, tags: ['桥梁']},
  {word: 'Suspension Bridge', phonetic: '[saspenshon bridj]', trans: '悬索桥', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Suspension bridge spans long distance.', zh: '悬索桥跨越长距离。'}], difficulty: 2, tags: ['桥梁']},
  {word: 'Cable-Stayed Bridge', phonetic: '[keibl steid bridj]', trans: '斜拉桥', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Cable-stayed bridge is efficient.', zh: '斜拉桥效率高。'}], difficulty: 2, tags: ['桥梁']},
  {word: 'Girder', phonetic: '[ga:de]', trans: '主梁', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Girder carries dead load.', zh: '主梁承受恒荷载。'}], difficulty: 1, tags: ['桥梁']},
  {word: 'Box Girder', phonetic: '[boks ga:de]', trans: '箱梁', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Box girder has high torsional rigidity.', zh: '箱梁抗扭刚度大。'}], difficulty: 2, tags: ['桥梁']},
  {word: 'Prestressed Concrete', phonetic: '[pri:strest konkri:t]', trans: '预应力混凝土', pos: 'n.', category: '桥梁', bilingual_examples: [{en: 'Prestressed concrete reduces cracking.', zh: '预应力混凝土减少开裂。'}], difficulty: 2, tags: ['桥梁']},
  {word: 'Welded Joint', phonetic: '[weldid joint]', trans: '焊接接头', pos: 'n.', category: '连接', bilingual_examples: [{en: 'Welded joint requires inspection.', zh: '焊接接头需要检验。'}], difficulty: 2, tags: ['钢结构']},
  {word: 'Bolted Connection', phonetic: '[baultid konekshon]', trans: '螺栓连接', pos: 'n.', category: '连接', bilingual_examples: [{en: 'Bolted connection is easy to assemble.', zh: '螺栓连接便于安装。'}], difficulty: 1, tags: ['钢结构']},
  {word: 'High Strength Bolt', phonetic: '[hai strengt bault]', trans: '高强螺栓', pos: 'n.', category: '连接', bilingual_examples: [{en: 'High strength bolt bears heavy load.', zh: '高强螺栓承受重荷载。'}], difficulty: 2, tags: ['钢结构']},
  {word: 'Engineer', phonetic: '[endjinie]', trans: '工程师', pos: 'n.', category: '合同', bilingual_examples: [{en: 'Engineer issues construction instructions.', zh: '工程师发布施工指令。'}], difficulty: 1, tags: ['FIDIC']},
  {word: 'Variation Order', phonetic: '[vearieshon o:de]', trans: '变更令', pos: 'n.', category: '合同', bilingual_examples: [{en: 'Variation order changes scope.', zh: '变更令改变工程范围。'}], difficulty: 2, tags: ['FIDIC']},
  {word: 'Certificate of Completion', phonetic: '[setifikeit ov kompli:shon]', trans: '竣工证书', pos: 'n.', category: '合同', bilingual_examples: [{en: 'Certificate of Completion is issued.', zh: '颁发竣工证书。'}], difficulty: 2, tags: ['FIDIC']},
  {word: 'Retention Money', phonetic: '[ritenshon mani]', trans: '保留金', pos: 'n.', category: '合同', bilingual_examples: [{en: 'Retention money is 10% of contract.', zh: '保留金为合同的10%。'}], difficulty: 2, tags: ['FIDIC']},
  {word: 'Provisional Sum', phonetic: '[provizhonl sam]', trans: '暂列金额', pos: 'n.', category: '合同', bilingual_examples: [{en: 'Provisional sum covers unforeseen work.', zh: '暂列金额用于不可预见工作。'}], difficulty: 3, tags: ['FIDIC']},
  {word: 'Daywork', phonetic: '[deiwo:k]', trans: '计日工', pos: 'n.', category: '合同', bilingual_examples: [{en: 'Daywork is paid hourly.', zh: '计日工按小时计酬。'}], difficulty: 2, tags: ['FIDIC']},
  {word: 'Soil Nailing', phonetic: '[soil neiling]', trans: '土钉支护', pos: 'n.', category: '岩土', bilingual_examples: [{en: 'Soil nailing stabilizes slope.', zh: '土钉支护稳定边坡。'}], difficulty: 2, tags: ['岩土']},
  {word: 'Diaphragm Wall', phonetic: '[daiagram wo:l]', trans: '地下连续墙', pos: 'n.', category: '岩土', bilingual_examples: [{en: 'Diaphragm wall prevents water inflow.', zh: '地下连续墙防止渗水。'}], difficulty: 3, tags: ['岩土']},
  {word: 'Compaction', phonetic: '[kompakshon]', trans: '压实', pos: 'n.', category: '岩土', bilingual_examples: [{en: 'Compaction improves soil density.', zh: '压实提高土壤密度。'}], difficulty: 1, tags: ['岩土']},
  {word: 'Shear Strength', phonetic: '[shia strengt]', trans: '抗剪强度', pos: 'n.', category: '岩土', bilingual_examples: [{en: 'Shear strength determines stability.', zh: '抗剪强度决定稳定性。'}], difficulty: 2, tags: ['岩土']},
  {word: 'Bearing Capacity', phonetic: '[bearing kapasiti]', trans: '承载力', pos: 'n.', category: '岩土', bilingual_examples: [{en: 'Bearing capacity meets design requirement.', zh: '承载力满足设计要求。'}], difficulty: 2, tags: ['岩土']},
];

let maxId = 520;
newTerms.forEach(t => {
  maxId++;
  t.id = 'term_' + String(maxId).padStart(3, '0');
  data.terms.push(t);
});

data.learning_progress.total_words = data.terms.length;

fs.writeFileSync('./data/youdao_style.json', JSON.stringify(data, null, 2));
console.log('添加了', newTerms.length, '条术语');
console.log('总术语数:', data.terms.length);
