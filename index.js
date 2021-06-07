var Bits = [];
var email = [];
var success = document.getElementById("success");
var warning = document.getElementById("warning");

function welcome() {
  inputBits();
  setInterval(time, 1000);

  function time() {
    var now1 = new Date(new Date()).toString().slice(0, 15)
    var now2 = new Date(new Date()).toString().slice(15, 31);
    document.getElementById("now1").innerHTML = now1;
    document.getElementById("now2").innerHTML = now2;
    document.getElementsByClassName("info")[0].style.display = "none";
  };
};

$(document).ready(function () {
  $("#statusBits").click(function () {
    var a = confirm("Merubah Bits akan menghapus seluruh input dan hasil, lanjutkan?");
    if (a == true) {
      inputBits();
      $(".reset").val("");
      $("#download").hide();
      $("table").hide();
      $("#thisEnc").hide();
      $("#thisDec").hide();
      $("#infinite").show();
      $("#infinite2").show();
    };
  });
  $("#qrPkey").click(function () {
    var x = document.getElementById("qrPkey");
    var y = x.src;
    var a = document.createElement("a");
    a.href = y;
    a.download = "QR";
    a.target = "_blank";
    a.click();
  });
  $("#qrID").click(function () {
    var x = document.getElementById("qrID");
    var y = x.src;
    var a = document.createElement("a");
    a.href = y;
    a.download = "QR";
    a.target = "_blank";
    a.click();
  });
  $("#qrEnc").click(function () {
    var x = document.getElementById("qrEnc");
    var y = x.src;
    var a = document.createElement("a");
    a.href = y;
    a.download = "QR";
    a.target = "_blank";
    a.click();
  });
  $("#qrDec").click(function () {
    var x = document.getElementById("qrDec");
    var y = x.src;
    var a = document.createElement("a");
    a.href = y;
    a.download = "QR";
    a.target = "_blank";
    a.click();
  });

  $("#fadeEnc").click(function () {
    $("#thisEnc").fadeToggle(1000);
    $("#thisDec").hide();
    $("#infinite").hide();
    $("#infinite2").hide();
  });

  $("#fadeDec").click(function () {
    $("#thisDec").fadeToggle(1000);
    $("#thisEnc").hide();
    $("#infinite").hide();
    $("#infinite2").hide();
  });
});

function reset() {
  warning.play();
  var a = confirm("Hapus seluruh input dan hasil?");
  if (a == true) {
    $(".reset").val("");
    alert("Hapus input berhasil.");
    $("#download").hide();
    $("table").hide();
    $("#thisEnc").hide();
    $("#thisDec").hide();
    $("#infinite").show();
    $("#infinite2").show();
    $("#info1").show();
    $("#info2").hide();
  };
};

function pKey() {
  document.getElementById("createPublicKey").innerHTML = "Memuat data..";
  document.getElementById("createPublicKey").style.color = "blue";
  setTimeout(wait, 1000);

  function wait() {
    var PassPhrase = document.getElementById("passOne").value;
    var RSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
    var PublicKeyString = cryptico.publicKeyString(RSAkey);
    document.getElementById("publicKey").value = PublicKeyString;
    document.getElementById("createPublicKey").innerHTML = "Kunci Publik";
    document.getElementById("createPublicKey").style.color = "purple";
    $("#download").show();
    $("#tb1").show();
    success.play();
    makeQR(PublicKeyString, "#qrPkey");
  }
}

function enc() {
  document.getElementById("encBtn").innerHTML = "Sedang diproses, mohon tunggu..";
  document.getElementById("encBtn").style.color = "blue";
  setTimeout(wait, 1000);

  function wait() {
    var PlainText = document.getElementById("plain").value;
    PublicKeyString = document.getElementById("inputPublicKey").value;
    var passSender = document.getElementById("passSender").value;
    var RSAsender = cryptico.generateRSAKey(passSender, Bits);
    var EncryptionResult = cryptico.encrypt(PlainText, PublicKeyString, RSAsender);
    document.getElementById("enc").value = EncryptionResult.cipher;
    document.getElementById("publicKeyID").value = cryptico.publicKeyID(cryptico.publicKeyString(RSAsender));
    document.getElementById("encBtn").innerHTML = "Mulai";
    document.getElementById("encBtn").style.color = "purple";
    $("#download").show();
    $("#tb2").show();
    $("#qrID").show();
    $("#qrEnc").show();
    success.play();
    makeQR(cryptico.publicKeyID(cryptico.publicKeyString(RSAsender)), "#qrID");
    makeQR(EncryptionResult.cipher, "#qrEnc");
  }
}

function dec() {
  document.getElementById("decBtn").innerHTML = "Sedang diproses, mohon tunggu..";
  document.getElementById("decBtn").style.color = "blue";
  setTimeout(wait, 1000);

  function wait() {
    var CipherText = document.getElementById("enc2").value;
    var inputKey = document.getElementById("inputKey").value;
    var RSAkey = cryptico.generateRSAKey(inputKey, Bits);
    var DecryptionResult = cryptico.decrypt(CipherText, RSAkey);
    document.getElementById("dec").value = DecryptionResult.plaintext;
    document.getElementById("verifingPublicKeyID").value = cryptico.publicKeyID(DecryptionResult.publicKeyString);
    var sign = DecryptionResult.signature;
    if (sign == "verified") {
      document.getElementById("sign").value = "Terverifikasi";
      document.getElementById("sign").style.color = "green";
    } else {
      document.getElementById("sign").value = "Tidak terverifikasi";
      document.getElementById("sign").style.color = "red";
    }
    document.getElementById("decBtn").innerHTML = "Mulai";
    document.getElementById("decBtn").style.color = "purple";
    $("#download").show();
    $("#tb3").show();
    $("qrDec").show();
    success.play();
    makeQR(DecryptionResult.plaintext, "#qrDec");
  }
}

function download() {
  var now = new Date();
  a = now +
    "\n\nKunci Publik: \n" + document.getElementById("publicKey").value;
  b = now +
    "\n\nIdentitas Kunci Publik: \n" + document.getElementById("publicKeyID").value +
    "\n\nEncrypt: \n" + document.getElementById("enc").value;
  c = now +
    "\n\nIdentitas Kunci Publik: \n" + document.getElementById("verifingPublicKeyID").value +
    "\n\nStatus keaslian data: \n" + document.getElementById("sign").value +
    "\n\nDecrypt: \n" + document.getElementById("dec").value;
  a1 = now +
    "<br><br>Kunci Publik: <br>" + document.getElementById("publicKey").value;
  b1 = now +
    "<br><br>Identitas Kunci Publik: <br>" + document.getElementById("publicKeyID").value +
    "<br><br>Encrypt: <br>" + document.getElementById("enc").value;
  c1 = now +
    "<br><br>Identitas Kunci Publik: <br>" + document.getElementById("verifingPublicKeyID").value +
    "<br><br>Status keaslian data: <br>" + document.getElementById("sign").value +
    "<br><br>Decrypt: <br>" + document.getElementById("dec").value;

  let opsi1 = prompt("1. Download file\n2. Kirim ke email");
  if (opsi1 == 1) {
    let select1 = prompt("1. Kunci Publik\n2. Encrypt\n3. Decrypt");
    if (select1 == 1) {
      getPDF(a, "Kunci Publik " + Bits + " Bits");
    } else if (select1 == 2) {
      getPDF(b, "Encrypted " + Bits + " Bits");
    } else if (select1 == 3) {
      getPDF(c, "Decrypted " + Bits + " Bits");
    } else {
      alert("Input salah !");
    }

    function getPDF(a, b) {
      var doc = new jsPDF()
      x = 15;
      y = 15;
      result = doc.splitTextToSize(a, 175);
      doc.text(result, x, y);
      doc.save(b)
    }
  } else if (opsi1 == 2) {
    receiver = prompt("masukan email tujuan, gunakan ( , ) tanda koma jika penerima lebih dari satu :");
    if (receiver == "" || receiver == null) {
      alert("Email tidak boleh kosong !");
    } else {
      email.splice(0);
      email.push(receiver);
      alert("Silahkan pilih hasil data, server akan mengirim hasilnya ke alamat email :\n" + receiver);
      let select2 = prompt("1. Kunci Publik\n2. Encrypt\n3. Decrypt");
      if (select2 == 1) {
        sending(receiver, a1, 1, "QR Kunci Publik.png");
      } else if (select2 == 2) {
        sending(receiver, b1, 2, "QR Digital Signature.png");
      } else if (select2 == 3) {
        sending(receiver, c1, 3, "QR Decryption.png");
      } else {
        alert("Input salah !");
      }

      function sending(a, b, c, d) {
        var d2 = d;
        if (c == 1) {
          var x = document.getElementById("qrPkey");
          var x2 = document.getElementById("qrPkey");
        } else if (c == 2) {
          var x = document.getElementById("qrID");
          var x2 = document.getElementById("qrEnc");
          var d2 = "QR Encrypt.png";
        } else if (c == 3) {
          var x = document.getElementById("qrDec");
          var x2 = document.getElementById("qrDec");
        }
        var ganti = x.src;
        var dataUri = ganti.replace(/%20/g, "+");
        var ganti2 = x2.src;
        var dataUri2 = ganti2.replace(/%20/g, "+");
        Email.send({
          SecureToken: "bfe69410-1c17-4658-83dc-206f923f37b1",
          To: a,
          From: "muhammadmuhidin94@gmail.com",
          Subject: "Certificate security of RSA " + Bits,
          Body: b,
          Attachments: [{
              name: d,
              path: dataUri
            },
            {
              name: d2,
              path: dataUri2
            }
          ]
        }).then(
          message => alert(message)
        );
        email.splice(0);
        email.push(receiver);
        document.getElementById("email").innerHTML = email.toString();
        $("#info1").hide();
        $("#info2").show();
      };
    };
  };
};

function bg(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    $('body').css('background-image', 'url(' + reader.result + ')');
  }
  reader.readAsDataURL(file);
};

function inputBits() {
  var pushBits = prompt("Masukan nilai perhitungan,\nsaran antara 512 sampai 2048 Bits:");
  Bits.splice(0);
  Bits.push(pushBits);
  if (pushBits == "" || pushBits == null) {
    return inputBits();
  } else {
    document.getElementById("statusBits").innerHTML = " " + Bits + " Bits";
    alert(Bits + " Bits sukses diterapkan.");
  }
};

function makeQR(data, position) {
  var nric = data
  var url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + data + '&amp;size=50x50';
  $(position).attr("src", url);
};