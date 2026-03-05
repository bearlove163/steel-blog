const fs = require('fs');
const path = require('path');

function addMoreTerms() {
    const glossaryPath = path.join(__dirname, 'glossary.html');
    let content = fs.readFileSync(glossaryPath, 'utf8');
    
    // 要添加的新术语
    const newTerms = `
            <!-- 术语 9 -->
            <div class="term-card" data-category="structure">
                <div class="term-header">
                    <span class="term-en">Cantilever</span>
                    <span class="term-zh">悬臂结构</span>
                </div>
                <div class="term-body">
                    <p class="term-definition">
                        一端固定，另一端自由的构件。主要承受弯曲应力。
                    </p>
                    <div class="chalk-example">
                        <p class="chalk-title">📝 图解：悬臂结构</p>
                        <p class="chalk-line yellow">→ Cantilever = 悬臂</p>
                        <p class="chalk-line">→ 一端固定，一端自由</p>
                        <p class="chalk-line blue">→ 主要承受弯曲应力</p>
                        <p class="chalk-line pink">→ 常见应用：阳台、挑檐</p>
                    </div>
                </div>
            </div>
            
            <!-- 术语 10 -->
            <div class="term-card" data-category="design">
                <div class="term-header">
                    <span class="term-en">Deflection</span>
                    <span class="term-zh">挠度</span>
                </div>
                <div class="term-body">
                    <p class="term-definition">
                        结构或构件在荷载作用下产生的位移量。是正常使用极限状态的重要指标。
                    </p>
                    <div class="chalk-example">
                        <p class="chalk-title">📝 图解：挠度概念</p>
                        <p class="chalk-line yellow">→ Deflection = 挠度</p>
                        <p class="chalk-line">→ 竖向位移最大值</p>
                        <p class="chalk-line blue">→ L/250, L/400 等限制</p>
                        <p class="chalk-line pink">→ 影响舒适度和外观</p>
                    </div>
                </div>
            </div>
            
            <!-- 术语 11 -->
            <div class="term-card" data-category="material">
                <div class="term-header">
                    <span class="term-en">Young's Modulus</span>
                    <span class="term-zh">弹性模量</span>
                </div>
                <div class="term-body">
                    <p class="term-definition">
                        材料抵抗弹性变形的能力。钢材的弹性模量约为200 GPa。
                    </p>
                    <div class="chalk-example">
                        <p class="chalk-title">📝 图解：弹性模量</p>
                        <p class="chalk-line yellow">→ E = Stress / Strain</p>
                        <p class="chalk-line">→ 钢材: E ≈ 200 GPa</p>
                        <p class="chalk-line blue">→ 混凝土: E ≈ 30 GPa</p>
                        <p class="chalk-line pink">→ 铝材: E ≈ 70 GPa</p>
                    </div>
                </div>
            </div>
            
            <!-- 术语 12 -->
            <div class="term-card" data-category="construction">
                <div class="term-header">
                    <span class="term-en">Precipitation Hardening</span>
                    <span class="term-zh">沉淀硬化</span>
                </div>
                <div class="term-body">
                    <p class="term-definition">
                        通过热处理提高钢材强度的工艺方法。
                    </p>
                    <div class="chalk-example">
                        <p class="chalk-title">📝 图解：热处理</p>
                        <p class="chalk-line yellow">→ Solution Treatment</p>
                        <p class="chalk-line">→ Aging Treatment</p>
                        <p class="chalk-line blue">→ 提高强度和硬度</p>
                        <p class="chalk-line pink">→ 常见于不锈钢</p>
                    </div>
                </div>
            </div>
`;
    
    // 在 </div>    </div> 之前插入新术语 (line 527: </div></div>)
    const insertPosition = content.indexOf('        </div>\n    </main>');
    if (insertPosition !== -1) {
        content = content.slice(0, insertPosition) + newTerms + '\n' + content.slice(insertPosition);
        fs.writeFileSync(glossaryPath, content, 'utf8');
        console.log('✅ 术语添加成功！');
    } else {
        console.log('❌ 未找到插入位置');
    }
}

addMoreTerms();
