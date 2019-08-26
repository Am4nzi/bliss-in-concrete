console.log("Sanity Check");

(function() {

    new Vue({
        el: "#main",
        data: {
            name: "Sassafrass", //These properties are reactive
            images: [],
            myClassName: "color" + Math.floor(Math.random() * 2),
            
        },
        mounted: function() {
            var me = this;
            axios.get('/begin')
                .then(function(results) {
                    me.images = results.data;
                    console.log(me.images);
                });
        },
        methods: {
            randomColor: (function () {
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                var randomColor = "rgb(" + r + "," + g + "," + b + ")";
                return randomColor;
            })()


        }
    });

})();
