<template>
  <div id="test-html-to-pdf">
    <!-- <export-docx /> -->
    <div id="source-html">
      fdsafdfsafdsasdfs

      <p style="page-break-before: always">Page #2...</p>
      <p style="page-break-before: always">PAGE BREAK</p>

      <p style="page-break-before: always">Page #3...</p>
    </div>

    <div class="content-footer">
      <button id="btn-export" @click="exportHTML()">Export to word doc</button>
      <button id="btn-export" @click="windowPrint()">windowPrint</button>
    </div>
  </div>
</template>

<script>
import { saveAs } from "file-saver";

export default {
  name: "App",
  components: {},
  methods: {
    exportHTML() {
      var header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='https://www.w3.org/TR/html40/'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";

      var footer = "</body></html>";

      var style = `<style>
                      #test {
                        height: 300px;
                        background-color: orange;
                        border: 2px solid yellow;
                      }
                    </style> `;

      var sourceHTML =
        header +
        style +
        document.getElementById("source-html").innerHTML +
        footer;

      sourceHTML = `
        <html xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
        xmlns="http://www.w3.org/TR/REC-html40">

        <head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><title></title>

        <xml>
        <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
        </xml>
<style>
p {
  color: orange;
  page-break-before: always;
}
</style>
        </head>

        <body>

        ${String(document.getElementById("source-html").innerHTML)}

        fdsafdfsafdsasdfs

        <p>Page #2...</p>
        <p>PAGE BREAK</p>
        <p>Page #3...</p>
      `;

      console.log("sourceHTML", sourceHTML);

      var source =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(sourceHTML);

      saveAs(source, "detailed_report.doc");
    },
    windowPrint() {
      window.print();
    },
  },
};
</script>

<style>
#test {
  height: 300px;
  background-color: orange;
  border: 2px solid yellow;
}

@media print {
  body * {
    visibility: hidden;
  }
  #test-html-to-pdf,
  #test-html-to-pdf * {
    visibility: visible;
  }
}
</style>