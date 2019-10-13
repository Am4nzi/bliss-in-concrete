(function() {
  new Vue({
    el: "#main",
    data: {
      imageId: "",
      showModal: false,
      images: [],
      moreImages: [],
      allImages: [],
      title: "",
      description: "",
      username: "",
      url: "",
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
          console.log("Error in mounted in script.js", err);
        });
    },
    methods: {
      showModalMethod: function(imageId) {
        this.showModal = true;
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
        alert("Image upload disabled for security purposes");
        //TO UNABLE IMAGE UPLOAD, UNCOMMENT BELOW CODE
        // axios
        //   .post("/upload", formData)
        //   .then(function(res) {
        //     var imageUrl = res.data;
        //     me.images.unshift(imageUrl);
        //   })
        //   .catch(function(err) {
        //     console.log("Error in post /upload in script.js", err);
        //   });
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
            if (me.images.length > 4) {
              me.moreImages = results.data;
              Array.prototype.push.apply(me.images, me.moreImages);
            }
            if (me.images.length % 24 != 0) {
              me.hideMoreButton = "hideButton";
            }
          })
          .catch(err => {
            console.log("Error in mounted in script.js", err);
          });
      }
    }
  });

  axios
    .get("api/getdata")
    .then(
      function(response) {
        this.test = response.data;
      }.bind(this)
    )
    .catch(function(error) {});

  Vue.component("image-modal", {
    template: "#image-modal-template",
    props: ["showModal", "imageId"],
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
          console.log("Error in /showModalImage in mounted in script.js", err);
        });
      axios
        .get("/showComment/" + me.imageId)
        .then(function(results) {
          console.log(
            "Logging results.data.rows /showComment/ in GET: ",
            results
          );
          me.comments = results.data;
        })
        .catch(function(error) {
          console.log("Eror in /showComment: ", error);
          if (error) {
            this.showModal = false;
          }
        });
    },

    methods: {
      closeModal: function() {
        this.$emit("close");
      },
      addComment: function(e) {
        e.preventDefault();
        var me = this;

        axios
          .post("/comment/" + me.imageId, this.form)
          .then(function(results) {
            me.comments.unshift(results.data);
          })
          .catch(function(err) {
            console.log("Error when adding comment: ", err);
          });
      }
    }
  });
})();
