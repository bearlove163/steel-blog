const fs = require('fs');
const path = require('path');

// 术语数据
const terms = [
    // 结构类型
    { category: 'structure', en: 'Space Frame', zh: '网架结构', definition: '由多根杆件按照一定的网格形式通过节点连结而成的空间结构体系。常见形式包括网架、网壳等。', lines: ['→ Space Frame = 空间 + 框架', '→ 由双向/三向交叉杆件组成', '→ 优点：大跨度、轻量化、美观', '→ 常见应用：体育馆、机场、展厅'] },
    { category: 'structure', en: 'Space Truss', zh: '空间桁架', definition: '由杆件组成的三维桁架结构，主要承受轴向力。', lines: ['→ 三维空间桁架结构', '→ 主要承受轴向力', '→ 优点：强度高、重量轻', '→ 常见应用：体育馆、桥梁'] },
    { category: 'structure', en: 'Moment Frame', zh: '框架体系', definition: '依靠梁柱节点的刚性连接来抵抗荷载的结构体系，能提供较大的侧向刚度。', lines: ['→ Moment = 力矩', '→ Rigid Connection: 刚性连接', '→ 抵抗弯矩 → 提供抗侧力', '→ vs 铰接框架: 刚度更大'] },
    { category: 'structure', en: 'Braced Frame', zh: '支撑框架', definition: '由框架和支撑组成的结构体系，通过支撑来抵抗侧向力。', lines: ['→ Braced = 支撑', '→ 抗侧力体系', '→ 中心支撑 vs 偏心支撑', '→ 常见应用：高层建筑'] },
    { category: 'structure', en: 'Shear Wall', zh: '剪力墙', definition: '主要承受水平荷载的墙体结构构件。', lines: ['→ Shear Wall = 剪力墙', '→ 主要承受水平荷载', '→ 钢筋混凝土结构', '→ 常见应用：高层建筑'] },
    { category: 'structure', en: 'Tube Structure', zh: '筒体结构', definition: '由密柱深梁构成的空间筒状结构体系。', lines: ['→ Tube = 筒体', '→ 密柱深梁构成', '→ 空间筒状结构', '→ 常见应用：超高层建筑'] },
    
    // 构件类型
    { category: 'structure', en: 'Steel Column', zh: '钢柱', definition: '钢结构建筑中的主要承重构件，主要承受轴向压力。', lines: ['→ Steel Column = 钢柱', '→ 主要承受轴向压力', '→ 常见截面：H型、箱型、圆形', '→ 连接钢梁和基础'] },
    { category: 'structure', en: 'Steel Beam', zh: '钢梁', definition: '钢结构建筑中的主要受弯构件，主要承受弯矩和剪力。', lines: ['→ Steel Beam = 钢梁', '→ 主要承受弯矩和剪力', '→ 常见截面：H型、工字型', '→ 支撑楼板和屋面'] },
    { category: 'structure', en: 'Girder', zh: '主梁', definition: '结构中的主要承重梁，通常跨度较大。', lines: ['→ Girder = 主梁', '→ 大跨度构件', '→ 主要承受弯矩', '→ 常见于桥梁和楼层'] },
    { category: 'structure', en: 'Purlin', zh: '檩条', definition: '屋面结构中的次要承重构件，用于支撑屋面板。', lines: ['→ Purlin = 檩条', '→ 屋面次构件', '→ 支撑屋面板', '→ 常见于工业厂房'] },
    
    // 连接方式
    { category: 'connection', en: 'Welded Connection', zh: '焊接连接', definition: '通过加热使金属熔化并连接在一起的连接方式。是钢结构中最主要的连接形式之一。', lines: ['→ Fillet Weld: 角焊缝', '→ Butt Weld: 对接焊缝', '→ groove: 坡口', '→ Weld Metal: 焊缝金属'] },
    { category: 'connection', en: 'Bolted Connection', zh: '螺栓连接', definition: '使用螺栓将钢结构构件连接在一起的连接方式，分为普通螺栓和高强度螺栓。', lines: ['→ High-Strength Bolt: 高强螺栓', '→ Friction Type: 摩擦型', '→ Bearing Type: 承压型', '→ Pretension: 预拉力'] },
    { category: 'connection', en: 'Rivet', zh: '铆钉', definition: '传统的钢结构连接方式，现在已较少使用。', lines: ['→ Rivet = 铆钉', '→ 传统连接方式', '→ 加热后铆接', '→ 现在较少使用'] },
    { category: 'connection', en: 'Fillet Weld', zh: '角焊缝', definition: '最常用的焊缝形式，焊缝截面呈三角形。', lines: ['→ Fillet = 角焊缝', '→ 三角形截面', '→ 承受剪切力', '→ 最常用的焊缝'] },
    { category: 'connection', en: 'Butt Weld', zh: '对接焊缝', definition: '对接接头处的焊缝，连接在同一平面上的构件。', lines: ['→ Butt = 对接', '→ 同一平面连接', '→ 承受轴向力', '→ 强度较高'] },
    
    // 材料
    { category: 'material', en: 'High-Strength Steel', zh: '高强度钢', definition: '指屈服强度不低于460MPa的钢材，用于需要承受大荷载的钢结构工程。', lines: ['→ Q235: fy = 235 MPa', '→ Q345: fy = 345 MPa', '→ Q460: fy = 460 MPa', '→ fy = 屈服强度'] },
    { category: 'material', en: 'Weathering Steel', zh: '耐候钢', definition: '具有良好耐大气腐蚀性的低合金钢，表面形成保护性锈层。', lines: ['→ Weathering = 耐候', '→ 耐大气腐蚀', '→ 表面锈层保护', '→ 常见于桥梁'] },
    { category: 'material', en: 'Stainless Steel', zh: '不锈钢', definition: '含铬量不低于12%的合金钢，具有良好的耐腐蚀性。', lines: ['→ Stainless = 不锈', '→ 含铬≥12%', '→ 良好耐腐蚀性', '→ 常见于装饰'] },
    { category: 'material', en: 'Steel Plate', zh: '钢板', definition: '钢材的一种形式，厚度大于4mm的板材。', lines: ['→ Steel Plate = 钢板', '→ 厚度>4mm', '→ 用于梁柱构件', '→ 常见于焊接构件'] },
    { category: 'material', en: 'Young\'s Modulus', zh: '弹性模量', definition: '材料抵抗弹性变形的能力。钢材的弹性模量约为200 GPa。', lines: ['→ E = Stress / Strain', '→ 钢材: E ≈ 200 GPa', '→ 混凝土: E ≈ 30 GPa', '→ 铝材: E ≈ 70 GPa'] },
    
    // 设计概念
    { category: 'design', en: 'Load Combination', zh: '荷载组合', definition: '结构设计时，考虑不同荷载同时出现的可能性而进行的荷载叠加组合。', lines: ['→ D + L: 恒载 + 活载', '→ D + L + E: 恒 + 活 + 地震', '→ 1.3D + 1.5L (LRFD)', '→ D=Dead, L=Live'] },
    { category: 'design', en: 'Dead Load', zh: '恒荷载', definition: '永久荷载，包括结构自重、固定设备重量等。', lines: ['→ Dead Load = 恒荷载', '→ 永久荷载', '→ 结构自重', '→ 固定设备重量'] },
    { category: 'design', en: 'Live Load', zh: '活荷载', definition: '可变荷载，包括人员、家具、设备等。', lines: ['→ Live Load = 活荷载', '→ 可变荷载', '→ 人员活动', '→ 家具设备'] },
    { category: 'design', en: 'Wind Load', zh: '风荷载', definition: '风对建筑物产生的作用力。', lines: ['→ Wind Load = 风荷载', '→ 水平作用力', '→ 随高度增加', '→ 重要：高层建筑'] },
    { category: 'design', en: 'Seismic Load', zh: '地震作用', definition: '地震时地面运动对建筑物产生的作用力。', lines: ['→ Seismic = 地震', '→ 水平作用力', '→ 随高度放大', '→ 重要：抗震设计'] },
    { category: 'design', en: 'Deflection', zh: '挠度', definition: '结构或构件在荷载作用下产生的位移量。是正常使用极限状态的重要指标。', lines: ['→ Deflection = 挠度', '→ 竖向位移', '→ L/250, L/400 限制', '→ 影响舒适度和外观'] },
    
    // 施工
    { category: 'construction', en: 'Steel Erection', zh: '钢结构吊装', definition: '将工厂预制的钢结构构件运至现场，通过吊装设备安装到位的施工过程。', lines: ['→ 1. 定位 Alignment', '→ 2. 吊装 Lifting', '→ 3. 临时固定', '→ 4. 终拧'] },
    { category: 'construction', en: 'Field Installation', zh: '现场安装', definition: '在施工现场进行的钢结构组装和连接工作。', lines: ['→ Field = 现场', '→ Installation = 安装', '→ 现场组装', '→ 螺栓连接/焊接'] },
    { category: 'construction', en: 'Alignment', zh: '对中', definition: '确保钢结构构件安装位置准确的施工步骤。', lines: ['→ Alignment = 对中', '→ 位置准确', '→ 测量控制', '→ 重要性：高精度'] },
    { category: 'construction', en: 'Lifting', zh: '吊装', definition: '使用起重机械将钢结构构件吊起并安装到位的施工过程。', lines: ['→ Lifting = 吊装', '→ 起重机械', '→ 安全第一', '→ 吊点设计'] },
    { category: 'construction', en: 'Fireproofing', zh: '防火', definition: '提高钢结构耐火极限的保护措施。', lines: ['→ Fireproofing = 防火', '→ 耐火极限', '→ 防火涂料', '→ 防火板'] },
    { category: 'construction', en: 'Corrosion Protection', zh: '防腐蚀', definition: '防止钢材腐蚀的保护措施。', lines: ['→ 防腐蚀措施', '→ 防腐涂料', '→ 阴极保护', '→ 耐候钢'] },
    
    // 图纸
    { category: 'design', en: 'Structural Drawing', zh: '结构图', definition: '表达结构设计内容的图纸。', lines: ['→ Structural = 结构', '→ Drawing = 图纸', '→ 结构设计表达', '→ 施工依据'] },
    { category: 'design', en: 'Shop Drawing', zh: '加工图', definition: '工厂加工制作用的详细图纸。', lines: ['→ Shop = 工厂', '→ 加工图纸', '→ 详细尺寸', '→ 制作依据'] },
    { category: 'design', en: 'Blueprint', zh: '蓝图', definition: '传统的工程图纸复制方式。', lines: ['→ Blueprint = 蓝图', '→ 传统图纸', '→ 蓝底白线', '→ 逐步淘汰'] },
    
    // 节点类型
    { category: 'connection', en: 'Rigid Joint', zh: '刚性节点', definition: '能够传递弯矩的节点连接。', lines: ['→ Rigid = 刚性', '→ 传递弯矩', '→ 角度不变', '→ 框架结构'] },
    { category: 'connection', en: 'Pin Joint', zh: '铰接节点', definition: '只能传递剪力的节点连接。', lines: ['→ Pin = 铰接', '→ 只传递剪力', '→ 自由转动', '→ 简支结构'] },
    { category: 'connection', en: 'Moment Connection', zh: '抗弯连接', definition: '能够传递弯矩的节点连接形式。', lines: ['→ Moment = 弯矩', '→ 抗弯连接', '→ 刚性连接', '→ 框架节点'] },
    
    // 钢结构产品
    { category: 'material', en: 'H-Section', zh: 'H型钢', definition: '截面呈H形的型钢，广泛应用于钢结构工程。', lines: ['→ H-Section = H型钢', '→ 截面H形', '→ 广泛应用的型钢', '→ 抗弯性能好'] },
    { category: 'material', en: 'I-Section', zh: 'I型钢', definition: '截面呈I形的型钢，也称为工字钢。', lines: ['→ I-Section = I型钢', '→ 截面I形', '→ 工字钢', '→ 常见于梁'] },
    { category: 'material', en: 'Box Section', zh: '箱形截面', definition: '截面呈箱形的构件，抗扭性能好。', lines: ['→ Box = 箱形', '→ 抗扭性好', '→ 常见于柱', '→ 承载力大'] },
    { category: 'material', en: 'Channel', zh: '槽钢', definition: '截面呈C形的型钢。', lines: ['→ Channel = 槽钢', '→ 截面C形', '→ 常见于次构件', '→ 轻型结构'] },
    { category: 'material', en: 'Angle', zh: '角钢', definition: '截面呈L形的型钢。', lines: ['→ Angle = 角钢', '→ 截面L形', '→ 常用连接件', '→ 轻型结构'] }
];

function createTermCard(term) {
    const chalkLines = term.lines.map(line => `<p class="chalk-line">${line}</p>`).join('\n');
    
    return `
            <!-- ${term.en} -->
            <div class="term-card" data-category="${term.category}">
                <div class="term-header">
                    <span class="term-en">${term.en}</span>
                    <span class="term-zh">${term.zh}</span>
                </div>
                <div class="term-body">
                    <p class="term-definition">
                        ${term.definition}
                    </p>
                    <div class="chalk-example">
                        <p class="chalk-title">📝 图解：${term.zh}</p>
                        ${chalkLines}
                    </div>
                </div>
            </div>`;
}

function addTermsToGlossary() {
    const glossaryPath = path.join(__dirname, 'glossary.html');
    let content = fs.readFileSync(glossaryPath, 'utf8');
    
    // 生成所有术语卡片
    const termCards = terms.map(term => createTermCard(term)).join('\n');
    
    // 找到插入位置（在最后一个 </div></div></div></main> 之前）
    const insertPattern = '        </div>\n    </main>';
    const insertPosition = content.lastIndexOf(insertPattern);
    
    if (insertPosition !== -1) {
        content = content.slice(0, insertPosition) + '\n' + termCards + '\n' + content.slice(insertPosition);
        fs.writeFileSync(glossaryPath, content, 'utf8');
        console.log(`✅ 成功添加 ${terms.length} 个术语！`);
    } else {
        console.log('❌ 未找到插入位置');
    }
}

addTermsToGlossary();
