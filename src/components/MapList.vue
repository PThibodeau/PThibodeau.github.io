<template>
    <div id="map-container">
        <div id="mapsList" v-for="{ id, grid } in maps" :key="id">
            <div v-for="(layer, layerIndex) in getGridLayer(grid)" :key="layerIndex">
                <div class="gridRow" :style="{'margin-top': getTileTopOffset(row), 'margin-left': getTileLeftOffset(row) }" v-for="(gridRow, row) in getGridRows(layer)" :key="gridRow">
                    <div class="gridColumnEntry" v-for="(gridColumnEntry, index) in gridRow" :key="index">
                        <img class="gridTile" :style="{ 'z-index': getZIndex(gridRow.length, index, row) }" :src="getImageSource(gridColumnEntry)" @click="handleTileClick(id, layerIndex, row, index)" draggable="false"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useLoadMaps, deleteMap, updateMap } from '@/firebase'

export default {
    setup() {
        const maps = useLoadMaps()
        let obj = {};
        let globalRows = [];
        return { maps, obj, globalRows, deleteMap }
    },
    beforeMount() {
        //remove me
    },
    methods: {
        getGridLayer(grid){
            this.obj = JSON.parse(grid);
            let layers = this.obj.layers
            return layers;
        },
        getGridRows(layer) {
            console.log(layer);
            let data = layer.data;
            let size = layer.width;
            let rows = [];
            for (let i=0; i<data.length; i+=size) {
                rows.push(data.slice(i,i+size));
            }
            this.globalRows = rows;
            return rows;
        },
        getImageSource(gridColumnEntry){
            //let imageSource;
            switch(gridColumnEntry) {
            case 1: //blue
                return require('@/images/blue.png');
            case 2: //red
                return require('@/images/red.png');
            default: //default to blue
                return require('@/images/blue.png');
                // var images = require.context('@/assets/', false, /\.jpg$/)
                // let productImage = ''
                // try {
                //     productImage = images(`./product${id}.jpg`)
                // } catch (error) {
                //     productImage = images(`./no_image.jpg`)
                // }
                // return productImage
            }        
        },
        getZIndex(length, index, row){
            //Might be able to change this to row instead of each tile.
            return (row * length) + (length - index);
        },
        getTileTopOffset(row){
            let pixels = 94;
            //let pixels = 19;
            //let offset = row * pixels;
            let marginTop = '-' + pixels +'px';
            return row !== 0 ? marginTop : '';
        },
        getTileLeftOffset(row){
            let isRowOdd = row % 2;
            let marginLeft = '128px';
            //let marginLeft = '38px';
            return isRowOdd ? marginLeft : '';
        },
        handleTileClick(id, layerIndex, row, index){
            this.globalRows[row][index] = this.globalRows[row][index] == 2 ? 1 : 2;
            let merged = [].concat.apply([], this.globalRows);
            let output = {...this.obj};
            output.layers[layerIndex].data = merged;
            let map = {'grid': JSON.stringify(output)};
            updateMap(id, map);
        }
    }
}
</script>

<style scoped>
    #map-container {
        margin-top: 75px;
        background-color: lightslategray;
        border: 5px solid rgba(17, 24, 39, var(--tw-bg-opacity));
        padding: 10px;
        width: 1190px;
        margin-right: auto;
        margin-left: auto;
    }

    #mapsList {
        transform: scale(0.3);
    }

    .gridColumnEntry {
        display: inline;
        display: block;
        float: left;
    }

    .gridRow {
        display: table;
    }

    .gridTile {
        position: relative;
        cursor: pointer;
        /* height: 3em; */
    }
</style>