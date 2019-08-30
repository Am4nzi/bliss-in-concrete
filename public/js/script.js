(function() {
    //This is called a 'view instance'
    new Vue({
        el: "#main",
        data: {
            imageId: "",
            showModal: false,
            images: [],
            title: "",
            description: "",
            username: "",
            url: "",
            //location.hash.slice(1);
            file: null,

        },

        mounted: function() {
            var me = this;
            axios
                .get("/showImages")
                .then(function(results) {
                    me.images = results.data;
                })
                .catch(err => {
                    console.log("ERROR in mounted in script.js", err);
                });
        },
        methods: {
            //The planet passed into the function is the variable passed in from HTML
            showModalMethod: function(imageId) {
                this.showModal = true;
                // console.log("imageId: ", imageId);
                //This line is what is passed into data (i.e. the name of the planet that is clicked on)
                this.imageId = imageId;
            },

            handleClick: function(e) {
                e.preventDefault();
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                var me = this;
                axios
                    .post("/upload", formData)
                    .then(function(res) {
                        var imageUrl = res.data;
                        me.images.unshift(imageUrl);
                    })
                    .catch(function(err) {
                        console.log("err in post /upload in script.js", err);
                    });
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
            },
            closeModalOnParent: function() {
                this.showModal = false;
            },
            showMore: function(e) {
                e.preventDefault();
                var me = this;
                axios
                    .get("/showImagesNew")
                    .then(function(results) {
                        me.images = results.data;
                    })
                    .catch(err => {
                        console.log("ERROR in mounted in script.js", err);
                    });
            }
        }
    });

    //This registers a Vue component
    Vue.component("image-modal", {
        template: "#image-modal-template",
        //Always called props and must be an array
        props: ["showModal", "imageId"],
        //mounted runs when the page loads
        data: function() {
            return {
                images: {},
                comments: [],
                form: {
                    comment: "",
                    username: ""
                }
            };
        },
        mounted: function() {
            // console.log(
            //     "logging this.imageId in mounted function",
            //     this.imageId
            // );
            var me = this;
            axios
                .get("/showModalImage/" + this.imageId)
                .then(function(results) {
                    me.images = results.data.rows[0];
                    // console.log("me.images in component", me.images);
                })
                .catch(err => {
                    console.log(
                        "ERROR in /showModalImage in mounted in script.js",
                        err
                    );
                });
            axios
                .get("/showComment/" + this.imageId)
                .then(function(results) {
                    me.comments = results.data.rows;
                    console.log(
                        "Logging results.data.rows in /showComment",
                        results.data.rows
                    );
                    // console.log("me.images in component", me.images);
                })
                .catch(err => {
                    console.log(
                        "ERROR in /showComment in mounted in script.js",
                        err
                    );
                });
        },

        //methods only run when the user does something (click, mouseover etc.)
        methods: {
            closeModal: function() {
                this.$emit("close");
            },
            addComment: function(e) {
                e.preventDefault();
                var me = this;
                console.log("Logging this in addComment", this);

                axios
                    .post("/comment/" + this.imageId, this.form)
                    .then(function(results) {
                        // console.log("results in addComment", results);
                        // console.log("Logging results in addComment", results);
                        // console.log("Logging me in addComment", me);
                        // console.log("Logging me.comment in addComment", me.comment);
                        // console.log("Logging me.form.comment in addComment", me.form.comment);
                        console.log(
                            "Logging me.comments in addComment",
                            me.comments
                        );
                        me.comments.unshift(results.data);
                    })
                    .catch(function(err) {
                        console.log("Error when adding comment: ", err);
                    });
            }
        }
    });
})();
