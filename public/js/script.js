(function() {
    //This is called a 'view instance'
    new Vue({
        el: "#main",
        data: {
            planet: "",
            imageId: "",
            showModal: false,
            images: [],
            title: "",
            description: "",
            username: "",
            url: "",
            file: null
        },

        mounted: function() {
            var me = this;
            axios
                .get("/begin")
                .then(function(results) {
                    // console.log(results.data);
                    me.images = results.data;
                    // console.log(me.images);
                })
                .catch(err => {
                    console.log("ERROR in mounted in script.js", err);
                });
        },
        methods: {
            //The planet passed into the function is the variable passed in from HTML
            showModalMethod: function(imageId) {
                this.showModal = true;
                console.log("imageId: ", imageId);
                //This line is what is passed into data (i.e. the name of the planet that is clicked on)
                this.imageId = imageId;
                // console.log("this", this);
            },

            handleClick: function(e) {
                e.preventDefault();

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                var me = this;
                console.log("this: ", this);

                axios
                    .post("/upload", formData)
                    .then(function(res) {
                        console.log("res in post/upload", res);
                        var imageUrl = res.data;
                        me.images.unshift(imageUrl);
                        console.log(
                            "Logging res in /upload in script.js: ",
                            res
                        );
                    })
                    .catch(function(err) {
                        console.log("err in post /upload in script.js", err);
                    });
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
            },
            closeModalOnParent: function() {
                console.log("closeModalOnParent!");
                this.showModal = false;
            }
        }
    });

    //This registers a Vue component
    Vue.component("image-modal", {
        template: "#image-modal-template",
        //Always called props and must be an array
        props: ["planet", "showModal", "imageId"],
        //mounted runs when the page loads
        data: function() {
            return { images: {} };
        },
        mounted: function() {
            console.log(
                "logging this.imageId in mounted function",
                this.imageId
            );
            var me = this;
            axios
                .get("/showModalImage/" + this.imageId)
                .then(function(results) {
                    me.images = results.data.rows[0];
                    console.log("me.images in component", me.images);
                })
                .catch(err => {
                    console.log("ERROR in mounted in script.js", err);
                });
        },
        //methods only run when the user does something (click, mouseover etc.)
        methods: {
            closeModal: function() {
                // console.log('CloseModal running!')
                this.$emit("close");
            }
        }
    });
})();
