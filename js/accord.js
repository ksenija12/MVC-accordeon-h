import { EventEmiter } from './core.js'

// class AccordModel extends EventEmiter {
//     constructor() {
//         super();
//     }
// }

// class AccordView extends EventEmiter {
//     constructor(model) {
//         super();

//         this._model = model;
//     }

//     render() {
        
//     }
// }

// class AccordController {
//     constructor(model, view) {
//         this._model = model;
//         this._view = view;
//     }
// }


// Инкапсуляция
// export class Accord {
//     constructor() {
//         const model = new AccordModel();
//         const view = new AccordView(model);
//         const controller = new AccordController(model, view);

        // this.model = model;
        // this.view = view;
        // this.controller = controller;

        // view.render();

//     }
// }

const accordItemSelector = ".accordeon__item"
const accordItemTitleSelector = ".accordeon__item-title";
const accordItemContentSelector = ".accordeon__item-content";

const  accordBtnSelector = ".accordeon__button-btn"

const accordItemActiveClass = 'accordeon__item_active'


class AccordModel extends EventEmiter {
    constructor() {
        super();

        this._activeAccord = 0;
        this._accordLength = undefined;

        this._singleMode = true;
        this._activeEl = [];
    }

    getActiveAccord() {
        return this._activeAccord;
    }

    setActiveAccord(index) {
        this._activeAccord = index;
    }

}

class AccordView extends EventEmiter {
    constructor(model) {
        super();

        this._model = model;

        $(accordItemTitleSelector).on('click', event => this.emit('openedAccord', $(event.currentTarget).parent(accordItemSelector).attr('data-id')));
        // $(accordBtnSelector).on('click', event => this.emit('openedAccord', $(event.currentTarget).parent(accordItemSelector).attr('data-id')));
    }

    initItem() {
        $(accordItemSelector).each(function(i, el) {
            
            $(el).attr('data-id', i);

            if ($(el).hasClass(accordItemActiveClass)) {
                $(el).children(accordItemContentSelector).show();
            } else {
                $(el).children(accordItemContentSelector).hide();
            }

        });
    

        $(accordBtnSelector).each(function(i, el) {
            $(el).attr('data-id', i)
        });
    }

    activateAccord(index) {
        $("#single").prop("checked") ? this._model._singleMode = true : this._model._singleMode = false;

        if (this._model._singleMode) {
            const $activeEl = $(accordItemSelector).filter(`[data-id=${index}]`);
            if ($activeEl.hasClass(accordItemActiveClass)) {
                $activeEl.removeClass(accordItemActiveClass)
                $activeEl.children(accordItemContentSelector).hide();
            } else {
                $(accordItemSelector).removeClass(accordItemActiveClass);
                $(accordItemSelector).children(accordItemContentSelector).hide();
                $activeEl.addClass(accordItemActiveClass).children(accordItemContentSelector).show();
            }
            
            
            // this._model._activeEl = [{
            //     "id": $activeEl.attr("data-id"),
            //     "itemElem": $activeEl[0],
            //     "titleElem": $activeEl.children(accordItemTitleSelector)[0],
            //     "contentElem": $activeEl.children(accordItemContentSelector)[0]
            // }]

            // console.log(this._model._activeEl)
        } else {
            const $activeParent = $(accordItemSelector).filter(`[data-id=${index}]`)
            $activeParent.toggleClass(accordItemActiveClass);
            // const that = this;
            $(accordItemSelector).each(function(i, el) {
                if ($(el).hasClass(accordItemActiveClass)) {
                    $(el).children(accordItemContentSelector).show();
                    // that._model._activeEl.push( {
                    //     "id": $(el).attr("data-id"),
                    //     "itemElem": $(el)[0],
                    //     "titleElem": $(el).children(accordItemTitleSelector)[0],
                    //     "contentElem": $(el).children(accordItemContentSelector)[0]
                    // })
                } else {
                    $(el).children(accordItemContentSelector).hide();
                    // const elem = that._model._activeEl.find(el => el.id == index)
                    // that._model._activeEl.splice(that._model._activeEl.indexOf(elem), [elem].length)
                };
            });
            
            // console.log(this._model._activeEl)
        };

        this.updateActiveState();

        
    };
    
    updateActiveState() {
        this._model._activeEl = [];
        
        const that = this;
        
        $(accordItemSelector).each(function(i, el) {
            if ($(el).hasClass(accordItemActiveClass)) {
                that._model._activeEl.push( {
                    "id": $(el).attr("data-id"),
                    "itemElem": $(el)[0],
                    "titleElem": $(el).children(accordItemTitleSelector)[0],
                    "contentElem": $(el).children(accordItemContentSelector)[0]
                })
            };
        });
        
        console.log(this._model._activeEl)
    }
    
    render() {
        this.initItem();

        this.activateAccord(this._model.getActiveAccord());
    };
}

class AccordController {
    constructor(model, view) {
        this._model = model;
        this._view = view;

        view.on("openedAccord", index => this.openAccord(index));
    }

    openAccord(index) {
        index = parseInt(index);


        this._view.activateAccord(index);
        this._model.setActiveAccord(index);


    }
}

export class Accord {
    constructor() {
        const model = new AccordModel();
        const view = new AccordView(model);
        const controller = new AccordController(model, view);

        this.model = model;
        this.view = view;
        this.controller = controller;    

        view.render();
    }

    getData() {
        return {
            activeAccord: this.model.getActiveAccord(),
            activeAccordElem: $(accordItemSelector).filter(`.${accordItemActiveClass}`)[0],
        };
    }

    setActiveAccord(index) {
        this.controller.openAccord(index);
    }

    on(event, callback) {
        this.controller[event] = callback;
    }
}