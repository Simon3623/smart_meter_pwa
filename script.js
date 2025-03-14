document.getElementById('meterForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // 取得GPS位置
  navigator.geolocation.getCurrentPosition(async position => {
    document.getElementById('gps').value = 
      position.coords.latitude + ',' + position.coords.longitude;

    const formData = new FormData();
    ['region','unit','address','gps','siteId','band','pci','rsrp','uploadSpeed',
     'downloadSpeed','commType','reason','dcuGps','dcuPower',
     'dcuTaipowerInfo','environment','note1','note2'].forEach(id => {
        formData.append(id, document.getElementById(id).value);
    });

    // 處理圖片檔案轉Base64
    const images = ['image1', 'image2', 'image3'];
    for (let i = 0; i < images.length; i++) {
      const fileInput = document.getElementById(images[i]).files[0];
      if (fileInput) {
        const base64 = await fileToBase64(fileInput);
        formData.append(`image${i+1}`, base64.split(',')[1]);
        formData.append(`fileName${i+1}`, fileInput.name);
        formData.append(`mimeType${i+1}`, fileInput.type);
      }
    }

    // 透過fetch送出到後端
    fetch('https://script.google.com/macros/s/AKfycbxdl06IFk2AzHy04Gnuv2q8ApcUJGEcygzJfN555h_3L9PQ9uwtLo7fjiCMBDNSLjJM/exec', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(response => alert('成功提交!'))
    .catch(err => alert('提交失敗：' + err));
  });
});

// 檔案轉base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
