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
            hideMoreButton: ""
        },

        mounted: function() {
            var me = this;
            axios
                .get("/showImages")
                .then(function(results) {
                    me.images = results.data;
                    if (me.images.length < 23) {
                        me.hideMoreButton = "hideButton";
                    }
                    if (me.images.length > 23) {
                        me.hideMoreButton = "";
                    }
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
                var imagesLength = me.images.slice(-1)[0].id;
                axios
                    .get("/showMoreImages/" + imagesLength)
                    .then(function(results) {
                        console.log(me.images);
                        console.log(imagesLength);
                        if (me.images.length > 4) {
                            me.images = results.data;
                        }
                        if (me.images.length % 24 != 0) {
                            me.hideMoreButton = "hideButton";
                        }
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
            var me = this;

            axios
                .get("/showModalImage/" + this.imageId)
                .then(function(results) {
                    me.images = results.data.rows[0];
                })
                .catch(err => {
                    console.log(
                        "ERROR in /showModalImage in mounted in script.js",
                        err
                    );
                });
            axios
                .get("/showComment/" + me.imageId)
                .then(function(results) {
                    // console.log("me.images in then", me.images);
                    console.log(
                        "Logging results.data.rows /showComment/ in GET: ",
                        results
                    );
                    me.comments = results.data;
                })
                .catch(function(error) {
                    console.log("ERROR in /showComment: ", error);
                    if (error) {
                        this.showModal = false;
                    }
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
                // console.log("Logging this in addComment", this);

                axios
                    .post("/comment/" + me.imageId, this.form)
                    .then(function(results) {
                        console.log(me.imageId);
                        me.comments.unshift(results.data);
                    })
                    .catch(function(err) {
                        console.log("Error when adding comment: ", err);
                    });
            }
        }
    });
})();
