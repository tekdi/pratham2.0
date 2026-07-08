// const fs = require('fs');
// const csv = require('csv-parser');

// const languages = ["English", "Marathi", "Hindi", "Telugu", "Bengali", "Tamil", "Gujarati", "Kannada", "Urdu", "Odiya", "Malayalam", "Assamese", "Punjabi"];
// const languageData = {};

// // Initialize languageData structure
// languages.forEach(lang => {
//     languageData[lang] = {};
// });

// // Read and parse the CSV file
// fs.createReadStream('/home/ttpl-rt-132/Tekdi Projects/sample/sample translation - Sheet1 (1).csv')
//     .pipe(csv())
//     .on('data', (row) => {
//         const module = row['Module'];
//         const key = row['Key'];
//         if (!module || !key) return;

//         languages.forEach(lang => {
//             if (!languageData[lang][module]) {
//                 languageData[lang][module] = {};
//             }
//             languageData[lang][module][key] = row[lang];
//         });
//     })
//     .on('end', () => {
//         // Write JSON files for each language
//         languages.forEach(lang => {
//             const jsonString = JSON.stringify(languageData[lang], null, 2);
//             fs.writeFileSync(`${lang.toLowerCase()}.json`, jsonString, 'utf-8');
//         });
//         console.log('JSON files have been successfully created.');
//     });





const fs = require('fs');
const csv = require('csv-parser');

// Map of full language names to their short codes
const languageCodes = {
    "English": "en",
    "Marathi": "mr",
    "Hindi": "hi",
     "Telugu": "tel",
     "Tamil": "tam",
     "Gujarati": "gu",
     "Kannada": "kan",
     "Urdu": "ur",
    "Odiya": "odi",
    
};

// Initialize languageData structure
const languageData = {};
Object.values(languageCodes).forEach(code => {
    languageData[code] = {};
});

// Read and parse the CSV file
fs.createReadStream('/home/ttpl-rt-132/Downloads/translation/Pratham_ Translations - Facilitator (1).csv')
.pipe(csv())
    .on('data', (row) => {
        const module = row['Module'] || '';
        const submodule = row['Submodule'] || '';
        const key = row['Key'];

        // Skip rows with empty 'Key'
        if (!key) return;

        Object.keys(languageCodes).forEach(lang => {
            const code = languageCodes[lang];
            const value = row[lang];
            if (value && value.trim() !== '') { // Only add if value is not empty
                if (module && submodule) {
                    // Module.Submodule.Key structure (e.g., LEARNER_APP.COMMON.L1_COURSES)
                    if (!languageData[code][module]) {
                        languageData[code][module] = {};
                    }
                    if (!languageData[code][module][submodule]) {
                        languageData[code][module][submodule] = {};
                    }
                    languageData[code][module][submodule][key] = value;
                } else if (module) {
                    // Module.Key structure (e.g., LEARNER_APP.other_filters)
                    if (!languageData[code][module]) {
                        languageData[code][module] = {};
                    }
                    languageData[code][module][key] = value;
                } else {
                    // Root-level key
                    languageData[code][key] = value;
                }
            }
        });
    })
    .on('end', () => {
        // Write JSON files for each language
        Object.values(languageCodes).forEach(code => {
            const jsonString = JSON.stringify(languageData[code], null, 2);
            fs.writeFileSync(`${code}.json`, jsonString, 'utf-8');
        });
        console.log('JSON files have been successfully created.');
    });
