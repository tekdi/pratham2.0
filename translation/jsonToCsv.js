const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Map of short codes to full language names
const languageCodes = {
    "en": "English",
    "mr": "Marathi",
    "hi": "Hindi",
      "odi": "Odiya",
    "tel": "Telugu",
    "kan": "Kannada",
   "tam": "Tamil",
    "gu": "Gujarati",
  "ur": "Urdu",
  
   
};

const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
        {id: 'Module', title: 'Module'},
        {id: 'Submodule', title: 'Submodule'},
        {id: 'Key', title: 'Key'},
        {id: 'English', title: 'English'},
        {id: 'Marathi', title: 'Marathi'},
        {id: 'Hindi', title: 'Hindi'},
        {id: 'Odiya', title: 'Odiya'},
        {id: 'Telugu', title: 'Telugu'},
        {id: 'Kannada', title: 'Kannada'},
        {id: 'Tamil', title: 'Tamil'},
        {id: 'Gujarati', title: 'Gujarati'},
        {id: 'Urdu', title: 'Urdu'},
        
    ]
});

const combinedData = {};

// Helper function to create a unique key for records
function createRecordKey(module, submodule, key) {
    return `${module || ''}|${submodule || ''}|${key || ''}`;
}

// Read each JSON file and populate the combinedData object
Object.keys(languageCodes).forEach(code => {
    const filePath = path.join("/home/ttpl-rt-132/Downloads/translation/", `${code}.json`);
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    Object.keys(jsonData).forEach(moduleOrKey => {
        if (typeof jsonData[moduleOrKey] === 'object' && jsonData[moduleOrKey] !== null && !Array.isArray(jsonData[moduleOrKey])) {
            // It's a module (e.g., LEARNER_APP)
            Object.keys(jsonData[moduleOrKey]).forEach(submoduleOrKey => {
                if (typeof jsonData[moduleOrKey][submoduleOrKey] === 'object' && jsonData[moduleOrKey][submoduleOrKey] !== null && !Array.isArray(jsonData[moduleOrKey][submoduleOrKey])) {
                    // It's a submodule (e.g., LEARNER_APP.COMMON)
                    Object.keys(jsonData[moduleOrKey][submoduleOrKey]).forEach(key => {
                        const recordKey = createRecordKey(moduleOrKey, submoduleOrKey, key);
                        if (!combinedData[recordKey]) {
                            combinedData[recordKey] = { 
                                Module: moduleOrKey, 
                                Submodule: submoduleOrKey, 
                                Key: key 
                            };
                        }
                        combinedData[recordKey][languageCodes[code]] = jsonData[moduleOrKey][submoduleOrKey][key];
                    });
                } else {
                    // It's a direct key under module (e.g., LEARNER_APP.other_filters)
                    const recordKey = createRecordKey(moduleOrKey, '', submoduleOrKey);
                    if (!combinedData[recordKey]) {
                        combinedData[recordKey] = { 
                            Module: moduleOrKey, 
                            Submodule: '', 
                            Key: submoduleOrKey 
                        };
                    }
                    combinedData[recordKey][languageCodes[code]] = jsonData[moduleOrKey][submoduleOrKey];
                }
            });
        } else {
            // It's a root-level key
            const recordKey = createRecordKey('', '', moduleOrKey);
            if (!combinedData[recordKey]) {
                combinedData[recordKey] = { 
                    Module: '', 
                    Submodule: '', 
                    Key: moduleOrKey 
                };
            }
            combinedData[recordKey][languageCodes[code]] = jsonData[moduleOrKey];
        }
    });
});

// Convert combinedData to an array of rows
const records = Object.values(combinedData);

// Separate complete and incomplete records
const languageFields = Object.values(languageCodes);
const englishField = languageCodes['en'];
const completeRecords = [];
const incompleteRecords = [];
const onlyEnglishRecords = [];

records.forEach(record => {
    const hasAllLanguages = languageFields.every(
        lang => record[lang] !== undefined && record[lang] !== null && record[lang] !== ''
    );
    const hasOnlyEnglish =
        record[englishField] !== undefined && record[englishField] !== null && record[englishField] !== '' &&
        languageFields.filter(lang => lang !== englishField)
            .every(lang => record[lang] === undefined || record[lang] === null || record[lang] === '');
    if (hasAllLanguages) {
        completeRecords.push(record);
    } else if (hasOnlyEnglish) {
        onlyEnglishRecords.push(record);
    } else {
        incompleteRecords.push(record);
    }
});

// Write the CSV file: complete, then incomplete, then only-English
csvWriter.writeRecords([...completeRecords, ...incompleteRecords, ...onlyEnglishRecords])
    .then(() => {
        console.log('CSV file has been successfully created.');
    })
    .catch(err => {
        console.error('Error writing CSV file', err);
    });
