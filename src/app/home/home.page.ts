import { Component } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  worker: Tesseract.Worker | undefined;
  workerReady = false;
  image = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
  ocrResult = '';
  captureProgress = 0;

  constructor() {
    this.loadWorker();
  }

  async loadWorker() {
    this.worker = await createWorker({
      logger: progress => {console.log(progress);
      if(progress.status === 'recognizing text') {
        this.captureProgress = parseInt(' ' + progress.progress * 100);
      }
    }
    });
    await this.worker.load();
    await this.worker.loadLanguage('por');
    await this.worker.initialize('por');
    console.log('Tesseract.js is ready');
    this.workerReady = true;
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    if (image && image.dataUrl) {
      this.image = image.dataUrl;
      console.log('imagem: ', image);
    } else {
      console.log('A propriedade "dataUrl" está indefinida na imagem capturada.');
    }
  }

  async recognizeImage() {
    if(this.worker){
      const result = await this.worker.recognize(this.image);
      console.log(result);
      this.ocrResult = result.data.text;
      this.filtraNome();
    }
    else {
      console.log('worker not ready');
    }
  }

  filtraNome(){
    if(this.ocrResult){
      //verificar se string contem a palavra "nome"
      if(this.ocrResult.includes("OME")){
        //se contem, pegar 30 caracteres da string a partir da palavra "nome"
        let nome = this.ocrResult.substring(this.ocrResult.indexOf("OME")+5, this.ocrResult.indexOf("OME")+35);
        console.log("nome = ");
        console.log(nome);
      }
      else{
        console.log("Não contém a palavra nome");
      }
    }

  }
}
