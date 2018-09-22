/*
* команда в консоли node create-project.js NAME
* скопирует данный проект в директорию NAME находящуюся на одном уровне с текущим проектом
* нужно чтобы глобально было установлено node.js
 */

const path = require('path');
const fs = require('fs');
const myFS = {
    stat: input => new Promise(((resolve, reject) => {
        fs.stat(input, (err, stats) => {
            if (err) return reject(err);
            resolve(stats);
        })
    })),

    exists: pathFor => new Promise((resolve, reject) => {
        fs.exists(pathFor, exists => exists ? resolve(pathFor) : reject(`директории ${pathFor} не существует`));
    }),

    unexists: pathFor => new Promise((resolve, reject) => {
        fs.exists(pathFor, exists => exists ? reject(`директория ${pathFor} уже существует`) : resolve(pathFor));
    }),

    readdir: pathFor => new Promise((resolve, reject) => {
        fs.readdir(pathFor, (err, files) => {
            err && reject(err);
            resolve({files, pathFor})
        });
    }),

    unlink: pathFor => new Promise((resolve, reject) => {
        fs.unlink(pathFor, err => {
            err && reject(err);
            console.log(`файл ${pathFor} успешно удален`);
            resolve();
        });
    }),

    link: (pathFor, newPath) => new Promise((resolve, reject) => {
        fs.link(pathFor, newPath, err => {
            err && reject(err);
            console.log(`файл ${pathFor} успешно скопирован`);
            resolve();
        });
    }),

    rmdir: pathFor => new Promise((resolve, reject) => {
        fs.rmdir(pathFor, err => {
            err && reject(err);
            console.log(`директория ${pathFor} успешно удалена`);
            resolve();
        });
    }),

    mkdir: pathFor => new Promise((resolve, reject) => {
        fs.mkdir(pathFor, err => {
            err && reject(err);
            console.log(`директория ${pathFor} успешно создана`);
            resolve();
        });
    }),

    // сортирует по длинне. По логике самые глубокие директории, которые надо удалить, имеют самый длинный путь к файлу
    ascendingSort: (a, b) => b.length - a.length,

};
const baseOperations = {
    scan (pathFor) {

        // Только сохраняет пути до всех файлов отдельно и папок отдельно
        return new Promise((resolve, reject) => {

            const arrFiles = [];
            const arrDirs = [];

            // Функция завершения, уменьшает счетчик, когда счетчик будет равен 0, значит все функции чтения завершены,
            // все пути записаны в массивы и можно эти пути передать дальше
            const endRead = () => !--count && resolve({arrFiles, arrDirs});

            let count = 0; // Создаем счетчик

            // Первоначальная проверка, файл или папка?
            myFS.stat(pathFor)

                .then(stats => {

                    // Если директория, то добавляем путь до нее в массив директорий и выполняем следующие действия
                    if (stats.isDirectory()) {
                        arrDirs.push(pathFor);

                        // Самовызывающаяся рекурсивная функция
                        (function readInside (pathFor) {

                            ++count; // Увеличиваем счетчик
                            myFS.readdir(pathFor)
                                .then(({files, pathFor}) => {

                                    // Если папка не пуста
                                    files.length ?
                                        // Бежим по файлам и записываем в соответствующие массивы пути, прочитывая каждую папку
                                        files.forEach((file, i) => {
                                            let input = path.join(pathFor, file);

                                            myFS.stat(input)
                                                .then(stats => {
                                                    if (stats.isDirectory()) {
                                                        if (!/node_modules|\.git|\.idea/.test(input)) {
                                                            arrDirs.push(input);
                                                            readInside(input); // читаем папку
                                                        }
                                                    } else {
                                                        if (!/create-project.js|yarn/.test(input)) arrFiles.push(input);
                                                    }
                                                    // Когда дошли до последнего файла, вызываем функцию завершения
                                                    i === files.length - 1 && endRead();
                                                })
                                                .catch(reject);
                                        }) :
                                        // Если папка пуста
                                        endRead();

                                })
                                .catch(reject);

                        })(pathFor);

                    } else {
                        // Если указанный путь - файл, то добавляем его в массив путей к файлам и заверваем функцию
                        arrFiles.push(pathFor);
                        endRead()
                    }
                })
                .catch(reject);
        })
    },

    copy (input, output) {
        return ({arrFiles, arrDirs}) => new Promise((resolve, reject) => {

            // Создаем новые пути для файлов, заменяя старые на новые
            let newFiles = arrFiles.map(file => file.replace(input, output));

            // Заменяем все пути папок на новые и сортируем так, чтобы первой в массиве была папка, в которой содержатся все остальные папки и файлы
            let _arrDirs = arrDirs.map(dir => dir.replace(input, output)).sort(myFS.ascendingSort).reverse();

            // Последовательно создаем каждую папку, начиная с корневой
            let promisesDirs = myFS.mkdir(_arrDirs[0]);
            for (let i = 1; i < _arrDirs.length; ++i) promisesDirs = promisesDirs.then(() => myFS.mkdir(_arrDirs[i]))

            // Когда все папки созданы, копируем все файлы, уже не важно в каком порядке
            promisesDirs
                .then(() => Promise.all(arrFiles.map((files, i) => myFS.link(files, newFiles[i]))))
                .then(() => resolve({arrFiles, arrDirs}))
                .catch(reject)

        });
    },
};

const copyDirectory = (input, output) => {
    const time = Date.now();
    myFS.unexists(output) // Если не существует папка с таких же названием, как у той, которую хотим создать...
        .then(() => myFS.exists(input)) // ... и существует папка из которой копировать, только тогда продолжаем
        .then(baseOperations.scan)
        .then(baseOperations.copy(input, output))
        .then(() => console.log(Date.now() - time, `milliseconds have passed`))
        .catch(console.error);

};

const name = process.argv[2];

if (!name) return console.error(`Не объявленно название нового проекта! name: ${name}`);
copyDirectory(__dirname, path.join(__dirname, '..', name));