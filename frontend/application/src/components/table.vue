<template>
<div class="table-wrapper">
    <div :id="id"/>
</div>
</template>

<script>
// @ is an alias to /src
import { isValid, deepClone } from "@/utils";
import { Grid, html } from "gridjs";
import { Tooltip } from "bootstrap";

export { html };

export default {
    name: 'tableControl',
    props: {
        id: String,
        header: Array,
        data: { // The rows in the table, passed via reactive so it can be updated before calls to forceUpdate()
            type: Object,
            default: { rows: [] }
        },
        canEdit: {
            type: Boolean,
            default: false
        },
        canRemove: {
            type: Boolean,
            default: false
        },
        actionColumn: String,
    },
    emits: ['remove', 'edit'], // Both get the content of the first column as parameter
    expose: [ 'update', 'forceUpdate' ],
    data() {
        return {
            grid: new Grid(),
            headerRow: [],
            rows: [],
            tooltips: [],
        }
    },
    computed: {
        tableData() { return this.rows; },
    },
    methods: {
        gridActionButtons(id, canEdit, canRemove, entity) {
            const editButton = `<div class='btn-action edit edit-${entity}' role='button' data-bs-toggle='tooltip' data-bs-title='${this.$t('ims.edit')}'><i class='bi bi-pencil-square' data-${entity}-id='${id}'></i></div>`;
            const removeButton = `<div class='btn-action remove remove-${entity}' role='button' data-bs-toggle='tooltip' data-bs-title='${this.$t('ims.remove')}'><i class='bi bi-x-lg' data-${entity}-id='${id}'></i></div>`;
            return `<div class='d-flex flex-nowrap gap-1 justify-content-center'>${canEdit ? editButton : ''}${canRemove ? removeButton : ''}</div>`;
        },
        wireActions() {
            let t = this;
            const editReqs = document.querySelectorAll(`.btn-action.edit-${this.$props.id} > i`);
            Array.from(editReqs).forEach(el => {
                el.addEventListener('click', t.editRow);
            });

            const removeReqs = document.querySelectorAll(`.btn-action.remove-${this.$props.id} > i`);
            Array.from(removeReqs).forEach(el => {
                el.addEventListener('click', t.removeRow);
            });

            const tooltipTriggers = document.querySelectorAll(`#${this.$props.id} [data-bs-toggle='tooltip']`);
            this.tooltips = [...tooltipTriggers].map(tooltipTrigger =>
                new Tooltip(tooltipTrigger, {
                    delay: { "show": 1000, "hide": 100 },
                    trigger: 'hover'
                }));
        },
        addActionsColumnToHeader() {
            // Add an Actions cell to the right end of the table header
            this.headerRow.push({
                name: this.$props.actionColumn,
                formatter: (cell) => html(this.gridActionButtons(cell, this.$props.canEdit, this.$props.canRemove, this.$props.id)),
            });
        },
        addActionsColumnToData() {
            this.rows.forEach(function (row, idx) {
                row.push(row[0]);
            });
        },
        update() {
            this.headerRow = deepClone(this.$props.header);
            this.rows = deepClone(this.$props.data.rows);
            const hasActions = this.$props.canEdit || this.$props.canRemove;
            if(hasActions) {
                this.addActionsColumnToHeader();
                this.addActionsColumnToData();

                let t = this;
                this.grid.on('ready', () => t.wireActions());
            }

            this.grid
                .updateConfig({
                    columns: this.headerRow,
                    data: this.tableData
                });
        },
        forceUpdate() {
            this.update();
            this.grid.forceRender();
        },
        hideTooltips() {
            for(let tooltip of this.tooltips)
                tooltip.hide();
        },
        editRow(event) {
            let el = event.target;
            const id = el.getAttribute(`data-${this.$props.id}-id`);
            this.hideTooltips();
            this.$emit('edit', id);
        },
        removeRow(event) {
            let el = event.target;
            const id = el.getAttribute(`data-${this.$props.id}-id`);

            let t = this;
            let found = false;
            this.rows.forEach(function(row, idx) {
                if(id === row[0].toString()) {
                    t.rows.splice(idx, 1);
                    found = true;
                }
            });
            if(!found) {
                console.log(`Cannot find item with id ${id} in table, cannot remove it`);
                return;
            }

            this.hideTooltips();
            this.$emit('remove', id);
        },
    },
    mounted() {
        // Set up the grid
        this.headerRow = deepClone(this.$props.header);
        this.rows = deepClone(this.$props.data.rows);
        const hasActions = this.$props.canEdit || this.$props.canRemove;
        if(hasActions) {
            this.addActionsColumnToHeader();
            this.addActionsColumnToData();

            let t = this;
            this.grid.on('ready', () => t.wireActions());
        }

        this.grid
            .updateConfig({
                columns: this.headerRow,
                data: this.tableData,
                width: '100%',
                resizable: true
            })
            .render(document.getElementById(this.$props.id));
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.btn-action {
    cursor: pointer;
    text-decoration: none;
    font-size: calc(1.5 * var(--bs-body-font-size));
    font-weight: bolder;
    color: black;
    opacity: 50%;
}
.btn-action.edit:hover {
    color: darkblue;
}
.btn-action:hover {
    opacity: 75%;
}
.btn-action.remove:hover {
    color: darkred;
}
.gridjs-td > span > :last-child {
    margin-bottom: 0!important;
}
</style>
