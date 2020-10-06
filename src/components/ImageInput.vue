<template>
  <div>
    <!-- slot for parent component to activate the file changer -->
    <div class="" style="text-align: -webkit-center;">
      <img v-if="!imageShowed" @click="launchFilePicker" src="@/assets/images/user.png" alt="login" style="border-radius:50%;width:120px;height:120px;">
      <img v-else :src="imageURL" style="border-radius:50%;width:120px;height:120px;" @click="launchFilePicker">
      <div style="margin-top:20px;">
        <vs-button @click="launchFilePicker" :color="imageShowed ? 'success' : 'primary'" type="filled">{{selectTxt}}</vs-button>
        <vs-button v-if="imageShowed" @click="removeImage" color="danger" type="filled">remove</vs-button>
      </div>
    </div>

    <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->
    <input type="hidden" :name="uploadFieldName1" />
    <input type="file"
       ref="file"
       :name="uploadFieldName"
       @change="onFileChange(
          $event.target.name, $event.target.files)"
       style="display:none">
    <!-- error dialog displays any potential error messages -->
    
  </div>
</template>

<script> 
  export default {
    data: ()=> ({
      selectTxt: 'Select',
      imageShowed: false,
      imageURL:'',
      errorDialog: null,
      errorText: '',
      uploadFieldName: '',
      uploadFieldName1: 'file',
      maxSize: 1024
    }),
    props: {
    // Use "value" to enable using v-model
      value: Object,
    },
    methods: {
      launchFilePicker(){
        this.$refs.file.click();
      },
      onFileChange(fieldName, file) {
        const { maxSize } = this
        let imageFile = file[0]
        if (file.length>0) {
          let size = imageFile.size / maxSize / maxSize
          if (!imageFile.type.match('image.*')) {
            // check whether the upload is an image
            this.errorDialog = true
            this.errorText = 'Please choose an image file'
          } else if (size>1) {
            // check whether the size is greater than the size limit
            this.errorDialog = true
            this.errorText = 'Your file is too big! Please select an image under 1MB'
          } else {
            // Append file into FormData and turn file into image URL
            let formData = new FormData()
            this.imageURL = URL.createObjectURL(imageFile)
            let iURL = URL.createObjectURL(imageFile)
            this.imageShowed = true
            this.uploadFieldName='file'
            this.uploadFieldName1=''
            this.selectTxt = 'Change'
            formData.append(fieldName, imageFile)
            // Emit the FormData and image URL to the parent component
            this.$emit('input', { formData, iURL })
          }
        }
      },
      removeImage() {
        this.uploadFieldName = ""
        this.uploadFieldName1 = "file"
        this.imageShowed = false
        this.$refs.file.value = null
        this.selectTxt = 'Select'
      }
    }
  }
</script>