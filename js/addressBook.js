/**
 * Created by Igor on 24.08.2017.
 */

"use strict";

let addressBook = function (_options) {
    debugger;

        let entryTemplate =
            '   <div class="col-md-4 phone">' +
            '   </div>' +
            '   <div class="col-md-3 firstname">' +
            '   </div>' +
            '   <div class="col-md-3 lastname">' +
            '   </div>' +
            '   <div class="col-md-2">' +
            '       <button type="button" class="btn btn-info detail-button" title="Details information">' +
            '           <i class="fa fa-address-card-o" aria-hidden="true"></i>' +
            '       </button>' +
            '       <div class="btn-group">' +
            '           <button type="button" class="btn btn-primary edit-button" title="Edit entry">' +
            '               <i class="fa fa-pencil-square-o" aria-hidden="true"></i>' +
            '           </button>' +
            '           <button type="button" class="btn btn-danger delete-button" title="Delete entry">' +
            '               <i class="fa fa-minus" aria-hidden="true"></i>' +
            '           </button>' +
            '        </div>' +
            '   </div>';

        let phoneFieldTemplate =
            '       <label for="phone">Another Phone</label>' +
            '       <div class="input-group">' +
            '           <input type="tel" autofocus class="form-control" name="phone2" id="phone2" pattern="[0-9]{8,12}" placeholder="9999999999" value="" required>' +
            '           <span class="input-group-btn">' +
            '               <button class="btn btn-secondary minus-button" type="button"><i class="fa fa-minus" aria-hidden="true"></i></button>' +
            '           </span>' +
            '       </div>';

        let infoPhoneFieldTemplate =
            '   <label for="phone">Another Phone</label>' +
            '   <input type="tel" class="form-control" name="phone2" value="" readonly="readonly">';



        let options;

        let Book;

        let doc = document, addEntryBtn, formCancelBtn, inputForm, searchForm, inputFormContainer, entriesContainer,
            infoForm, infoFormContainer, infoFormCancelBtn, searchButton, plusPhoneContainer, infoPlusPhoneContainer, plusPhoneButton;


        let defOptions = {
            addEntryBtn: '.add-button',
            formCancelBtn: '.cancel-button',
            infoFormCancelBtn: '.info-cancel-button',
            inputForm: '.input-form',
            searchForm: 'form.search',
            inputFormContainer: '.input-form-container',
            infoForm: '.info-form',
            infoFormContainer: '.info-form-container',
            entriesContainer: '.entries-container',
            entryEditButton: '.edit-button',
            entryDeleteButton: '.delete-button',
            entryDetailButton: '.detail-button',
            searchButton: '.search-button',
            plusPhoneButton: '.plus-button',
            minusPhoneButton: '.minus-button',
            plusPhoneContainer: '.plus-phone-container',
            infoPlusPhoneContainer: '.info-plus-phone-container'
        };

        let editedRow = undefined;

        let formFunctions = {

            clearForm: function (form) {
                form.removeAttribute('data-index');
                form.classList.remove("was-validated");
                form.reset();

                return formFunctions;
            },

            formToggleDisplay: function (elements) {

                let toggleElementDisplay = function (element) {
                    element.style.display = (element.style.display === "none" || element.style.display === "" || element.style.display === undefined ? "block" : "none");
                };

                elements.forEach(function (item) {
                    typeof item === 'object' && toggleElementDisplay(item);
                });

                return formFunctions;
            },

            clearEditForm: function () {
                editedRow = undefined;
                return formFunctions.clearForm(inputForm);
            },

            clearInfoForm: function () {

                return formFunctions.clearForm(infoForm);
            },

            editFormToggleDisplay: function () {
                let elements = [inputFormContainer];

                return formFunctions.formToggleDisplay(elements);
            },

            infoFormToggleDisplay: function () {
                let elements = [infoFormContainer];

                return formFunctions.formToggleDisplay(elements);
            }
        };

        /*let phoneFieldFunctions = {
            removePlusPhoneField: function () {
                while (plusPhoneContainer.hasChildNodes()) {
                    plusPhoneContainer.removeChild(plusPhoneContainer.firstChild);
                }
                plusPhoneContainer.classList.remove('mb-3');
            }
        };*/

        let eventHandlers = {


            formCancelBtn: function (ev) {
                ev.preventDefault();
                formFunctions
                    .editFormToggleDisplay()
                    .clearEditForm();

                return true;
            },

            infoFormCancelBtn: function (ev) {
                ev.preventDefault();
                formFunctions
                    .infoFormToggleDisplay()
                    .clearInfoForm();

                return true;
            },

            addEntryBtn: function (ev) {
                ev.preventDefault();
                formFunctions.editFormToggleDisplay();

                return true;
            },

            inputFormSubmit: function (ev) {
                let idx = -1;
                ev.preventDefault();
                if (this.checkValidity() !== false) {
                    let entry = utilityFunctions.FormToObject(inputForm);
                    if (!entry.isEmpty()) {
                        inputForm.dataset.isEmpty() && (idx = Book.push(entry) - 1);
                        inputForm.dataset.isEmpty() || (Book[idx = inputForm.dataset.index] = entry);
                        (idx !== undefined) && (Book[idx]['idx'] = idx);
                    }
                    localStorage['addressBook'] = JSON.stringify(Book);
                    idx < 0 || utilityFunctions.showEntry(entry, editedRow);
                    idx < 0 || (Book[idx]['idx'] = idx);

                    formFunctions
                        .editFormToggleDisplay()
                        .clearEditForm();

                    return true;
                }
                this.classList.add("was-validated");


                return false;
            },

            entryEditButton: function (ev) {
                ev.preventDefault();
                editedRow = this.parentNode.offsetParent.parentNode;
                let idx = editedRow.dataset.index;
                let item = Book[idx];
                Object.keys(item).forEach(function (key) {
                    inputForm.querySelector('[name=' + key + ']') && (inputForm.querySelector('[name=' + key + ']').value = item[key]);
                });
                inputForm.dataset.index = idx;
                formFunctions.editFormToggleDisplay();

                return true;
            },

            entryDetailButton: function (ev) {
                ev.preventDefault();
                let idx = this.offsetParent.parentNode.dataset.index;
                let item = Book[idx];
                Object.keys(item).forEach(function (key) {
                    infoForm.querySelector('[name=' + key + ']') && (infoForm.querySelector('[name=' + key + ']').value = item[key]);
                });
                inputForm.dataset.index = idx;
                formFunctions.infoFormToggleDisplay();

                return true;
            },

            entryDeleteButton: function (ev) {
                ev.preventDefault();
                let quest = confirm("Are you sure that you want to delete permanently this contact?");
                if (quest === true) {
                    let container = this.parentNode.offsetParent.parentNode;
                    let idx = container.dataset.index;
                    Book.splice(idx, 1);
                    localStorage['addressBook'] = JSON.stringify(Book);
                    entriesContainer.removeChild(container);
                }

                return false;
            },

            searchButton: function (ev) {
                ev.preventDefault();
                utilityFunctions.clearEntriesContainer();
                utilityFunctions.showEntries();
            },

            /*addNewPhoneField: function (ev) {
                ev.preventDefault();
                let da = doc.getElementById('phone');
                if( da.value === ""){
                    return true;
                } else {
                    plusPhoneContainer.innerHTML = phoneFieldTemplate;
                    infoPlusPhoneContainer.innerHTML = infoPhoneFieldTemplate;
                    infoPlusPhoneContainer.classList.add('mb-3');
                    plusPhoneContainer.classList.add('mb-3');
                }
            },*/

        };

        let Validation = {

            patterns: {
                tel: "\\D",
                text: "\\W",
            },

            inputValidation: function (ev) {
                let element = this;
                let value = element.value;
                let pattern = Validation.patterns[element.type];
                if (!pattern) {
                    return true;
                }
                let re = new RegExp(pattern);
                element.value = value.replace(re, '');
                inputForm.classList.add("was-validated");
            },

        };

        let utilityFunctions = {

            /*getBooksItemByIdx: function (Arr, idx) {
                let res = undefined;
                if (Arr) {
                    res = Arr.filter(function (item) {
                        return item['idx'] === idx;
                    });
                    res.length > 0 && (res = res[0]);
                }

                return res;
            },*/

            FormToObject: function (form) {
                let obj = {};
                let elements = form.elements;
                Object.keys(elements).forEach(function (item) {
                    /\D+/.test(item) && form.hasOwnProperty(item) && (obj[item] = elements[item].value);
                });

                return obj;
            },

            initHandlers: function () {
                addEntryBtn === undefined || addEntryBtn.addEventListener('click', eventHandlers.addEntryBtn);
                formCancelBtn === undefined || formCancelBtn.addEventListener('click', eventHandlers.formCancelBtn);
                infoFormCancelBtn === undefined || infoFormCancelBtn.addEventListener('click', eventHandlers.infoFormCancelBtn);
                if (inputForm !== undefined) {
                    inputForm.addEventListener('submit', eventHandlers.inputFormSubmit);
                    let inputs = inputForm.querySelectorAll('input');
                    inputs.forEach(function (input) {
                        input.addEventListener('input', Validation.inputValidation);
                    });
                }
                searchButton === undefined || searchButton.addEventListener('click', eventHandlers.searchButton);
                searchForm === undefined || searchForm.addEventListener('submit', eventHandlers.searchButton);
                /*plusPhoneButton === undefined || plusPhoneButton.addEventListener('click', eventHandlers.addNewPhoneField);*/

                return utilityFunctions;
            },

            setEntryHandlers: function (item) {
                if (item !== undefined) {
                    item.querySelector(options.entryEditButton).addEventListener('click', eventHandlers.entryEditButton);
                    item.querySelector(options.entryDetailButton).addEventListener('click', eventHandlers.entryDetailButton);
                    item.querySelector(options.entryDeleteButton).addEventListener('click', eventHandlers.entryDeleteButton);
                    // item.querySelector().addEventListener('click', eventHandlers.quickAddBtn);
                }

                return utilityFunctions;
            },

            showEntry: function (item, replaceElement = undefined) {
                let entry = doc.createElement('div');
                entry.innerHTML = entryTemplate;
                entry.classList.add('row', 'entry');
                entry.dataset.index = item.idx;
                Object.keys(item).forEach(function (key) {
                    entry.querySelector('.' + key) && (entry.querySelector('.' + key).innerText = item[key]);
                });

                (replaceElement === undefined) && entriesContainer.appendChild(entry);
                (replaceElement === undefined) || entriesContainer.replaceChild(entry, replaceElement);

                return utilityFunctions.setEntryHandlers(entry);
            },

            getSearchElements: function () {
                let searchPhrase = doc.querySelector('input[name=search]').value;
                let SearchElements = Book;
                if (typeof searchPhrase === 'string' && searchPhrase.length > 0) {
                    let reg = new RegExp(searchPhrase.toLowerCase());
                    SearchElements = Book.filter(
                        function (item) {
                            for (let key in item) {
                                if (item.hasOwnProperty(key) &&
                                    (typeof item[key] === "string") &&
                                    reg.test(item[key].toLowerCase())
                                ) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    );
                }
                return SearchElements;
            },

            showEntries: function () {
                let SearchBook = utilityFunctions.getSearchElements();
                SearchBook && SearchBook.length && SearchBook.forEach(function (item) {
                    utilityFunctions.showEntry(item);
                });

                return utilityFunctions;
            },

            clearEntriesContainer: function () {
                while (entriesContainer.firstChild) {
                    entriesContainer.removeChild(entriesContainer.firstChild);
                }
            }

        };

        let pub = {
            init: function () {
                options = Object.assign({}, _options, defOptions);

                addEntryBtn = doc.querySelector(options.addEntryBtn);
                searchButton = doc.querySelector(options.searchButton);
                formCancelBtn = doc.querySelector(options.formCancelBtn);
                infoFormCancelBtn = doc.querySelector(options.infoFormCancelBtn);
                inputFormContainer = doc.querySelector(options.inputFormContainer);
                inputForm = doc.querySelector(options.inputForm);
                searchForm = doc.querySelector(options.searchForm);
                entriesContainer = doc.querySelector(options.entriesContainer);
                plusPhoneContainer = doc.querySelector(options.plusPhoneContainer);
                infoFormContainer = doc.querySelector(options.infoFormContainer);
                infoForm = doc.querySelector(options.infoForm);
                plusPhoneButton = doc.querySelector(options.plusPhoneButton);
                infoPlusPhoneContainer = doc.querySelector(options.infoPlusPhoneContainer);

                Book = JSON.parse(localStorage.getItem('addressBook')) || [];

                utilityFunctions
                    .initHandlers()
                    .showEntries();

                return pub;
            }
        };

        Object.prototype.isEmpty = function () {
            for (let key in this) {
                if (this.hasOwnProperty(key)) {

                    return false;
                }
            }

            return true;
        };

        return pub.init();
    }
;