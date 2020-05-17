'use strict';
var allClassesEndpoint = "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan";
var detailedInfoEndpoint = "http://www.fulek.com/VUA/supit/GetKolegij/";

$(document).ready(function () {

    const xhr = new XMLHttpRequest();
    xhr.open("get", allClassesEndpoint);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            JSONController.init(this);
            Controller.init();
        }
    }

    xhr.send();
    $('.result').css("visibility", "hidden");

    const UIController = (function () {
        const text = document.querySelector('[type=text]');

        return {

            createDatalistElement: function () {
                const datalist = document.createElement('datalist');
                datalist.setAttribute('id', 'courseList');

                JSONController.getCourseNames().forEach(courseName => {
                    datalist.appendChild(UIController.getDatalistOption(courseName));
                });

                document.body.appendChild(datalist);
                text.setAttribute('list', 'courseList');
            },

            getDatalistOption: function (optionText) {
                return new Option(optionText);
            },

            createTableRow: function (json) {
                const table = document.getElementById('coursesBody');
                const tr = table.appendChild(document.createElement('tr'));
                const name = tr.appendChild(document.createElement('td'));
                name.innerHTML = json.kolegij;
                const ects = tr.appendChild(document.createElement('td'));
                ects.innerHTML = json.ects;
                const classes = tr.appendChild(document.createElement('td'));
                classes.innerHTML = json.sati;
                const lectures = tr.appendChild(document.createElement('td'));
                lectures.innerHTML = json.predavanja;
                const exercises = tr.appendChild(document.createElement('td'));
                exercises.innerHTML = json.vjezbe;
                const type = tr.appendChild(document.createElement('td'));
                type.innerHTML = json.tip;
                const btnColumn = tr.appendChild(document.createElement('td'));
                const btn = btnColumn.appendChild(document.createElement('button'));
                btn.innerText = 'Obriši';

                const sumEcts = document.getElementById('ects');
                const sumSati = document.getElementById('sati');

                btn.addEventListener('click', function () {
                    table.removeChild(tr);

                    sumSati.innerHTML = Controller.addToSatiSum(-json.sati);
                    sumEcts.innerHTML = Controller.addToEctsSum(-json.ects);
                    Controller.removeId(json.id);

                    if (table.childElementCount === 0) {
                        $('.result').css("visibility", "hidden");
                    }
                });

                sumSati.innerHTML = Controller.addToSatiSum(json.sati);
                sumEcts.innerHTML = Controller.addToEctsSum(json.ects);

                $('.result').css("visibility", "visible");
            },

            showDetails: function (courseName) {
                var id = JSONController.getCourseId(courseName);
                if (Controller.hasId(id)) {
                    return;
                }
                JSONController.getCourseData(id);
            }
        }
    })();

    const JSONController = (function () {
        let xhr;
        let jsonObj;
        return {
            init: function (_xhr) {
                xhr = _xhr;
                jsonObj = JSON.parse(xhr.responseText);
                UIController.createDatalistElement();
            },

            getCourseNames: function () {
                return jsonObj.map(course => course.label);
            },

            getCoursesData: function () {
                return jsonObj;
            },

            getCourseId: function (courseName) {
                const courseMatch = JSONController.getCoursesData().filter(course => course.label === courseName)[0];
                return courseMatch.value;
            },

            getCourseData: function (courseId) {

                const xhr = new XMLHttpRequest();
                xhr.open("get", detailedInfoEndpoint + courseId);
                xhr.onreadystatechange = function () {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        let jsonObj3 = JSON.parse(this.responseText);
                        Controller.insertId(courseId);
                        UIController.createTableRow(jsonObj3);
                    }
                }
                xhr.send();
            }
        }
    })();

    const Controller = (function () {
        const txt = document.querySelector('[type=text]');
        function onValueChange() {
            UIController.showDetails(txt.value);
        }
        let ectsSum = 0;
        let satiSum = 0;
        const ids = [];
        return {
            init: function () {
                txt.addEventListener('change', onValueChange);
                console.log('tu sam');
            },
            addToEctsSum: function (number) {
                ectsSum += number;
                return ectsSum;
            },
            addToSatiSum: function (number) {
                satiSum += number;
                return satiSum;
            },
            insertId: function (id) {
                ids.push(id);
            },
            removeId: function (id) {
                var ind = ids.indexOf(id);
                ids.splice(ind, 1);
            },
            hasId: function (id) {
                return ids.indexOf(id) > -1;
            }
        }
    })();
});
