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
        
        // Match <select ... className="..." ... > across multiple lines
        // It's a bit complex with regex, so let's match className="[^"]*" that are inside <select tag
        // Actually, matching the word 'className="' and just injecting if it's a select is tricky.
        
        // Simpler regex: look for <select [^>]*className="[^"]*"
        // Since React props can be over multiple lines, let's use a non-greedy match between <select and className="
        content = content.replace(/(<select[^>]*?className=")([^"]*)(")/gs, (match, prefix, classNames, suffix) => {
            let classes = classNames.split(' ');
            
            // Only modify if it looks like a styled element (has some tailwind classes)
            if (classes.some(c => c.startsWith('dark:'))) {
                let hasBgWhite = classes.includes('bg-white');
                let hasTextSec900 = classes.includes('text-secondary-900');
                
                if (!hasBgWhite) {
                    classes.push('bg-white');
                }
                if (!hasTextSec900) {
                    classes.push('text-secondary-900');
                }
                
                return prefix + classes.join(' ') + suffix;
            }
            return match;
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log('Modified:', filePath);
        }
    }
});

console.log('Total files modified:', modifiedCount);
