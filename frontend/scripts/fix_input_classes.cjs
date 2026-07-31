const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;

walkDir(srcDir, function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Match <input ... className="..." ... > and <textarea ... className="..." ... >
        const regexes = [
            /(<input[^>]*?className=")([^"]*)(")/gs,
            /(<textarea[^>]*?className=")([^"]*)(")/gs
        ];

        regexes.forEach(regex => {
            content = content.replace(regex, (match, prefix, classNames, suffix) => {
                // Skip if it's a checkbox or radio
                if (match.includes('type="checkbox"') || match.includes("type='checkbox'") || 
                    match.includes('type="radio"') || match.includes("type='radio'")) {
                    return match;
                }

                let classes = classNames.split(' ');
                
                // Only modify if it looks like a styled element (has some tailwind classes)
                // and has dark mode styling but missing light mode equivalents
                if (classes.some(c => c.startsWith('dark:'))) {
                    let hasBgWhite = classes.includes('bg-white');
                    let hasBgSec50 = classes.includes('bg-secondary-50');
                    let hasBgSec100 = classes.includes('bg-secondary-100');
                    let hasBgTransparent = classes.includes('bg-transparent');
                    
                    let hasTextSec900 = classes.includes('text-secondary-900');
                    let hasTextBlack = classes.includes('text-black');
                    
                    // Only add bg-white if there is NO light mode background color explicitly set
                    if (!hasBgWhite && !hasBgSec50 && !hasBgSec100 && !hasBgTransparent) {
                        classes.push('bg-white');
                    }
                    
                    // Only add text-secondary-900 if there is NO light mode text color explicitly set
                    if (!hasTextSec900 && !hasTextBlack) {
                        classes.push('text-secondary-900');
                    }
                    
                    return prefix + classes.join(' ') + suffix;
                }
                return match;
            });
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log('Modified:', filePath);
        }
    }
});

console.log('Total files modified:', modifiedCount);
