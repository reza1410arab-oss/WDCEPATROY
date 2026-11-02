const input = document.getElementById("inputData");
const generate = document.getElementById("generate");
const copy = document.getElementById("copy");
const copyNominal = document.getElementById("copyNominal");

const preview = document.getElementById("preview");
const totalData = document.getElementById("totalData");


let hasilExcel = "";
let hasilNominal = "";



function prosesData() {

    const raw = input.value.trim();

    hasilExcel = "";
    hasilNominal = "";
    preview.innerHTML = "";


    if (!raw) {

        totalData.textContent = "0 Data";
        return;

    }



    const lines = raw
        .split(/\r?\n/)
        .map(x => x.trim())
        .filter(x => x !== "");



    let data = [];
    let i = 0;



    while (i < lines.length) {


        if (
            lines[i] &&
            lines[i + 1] &&
            lines[i + 1].startsWith("Withdraw")
        ) {



            const userID = lines[i];

            const withdrawLine = lines[i + 1];



            // =========================
            // AMBIL NOMINAL WITHDRAW
            // =========================


            let nominal = "";


            const angka = withdrawLine.match(/\d[\d,]*/g);


            if (angka) {


                // ambil angka dengan koma terbesar
                // contoh: 41,250,000 bukan 25,040

                let nominalArray = angka.filter(x =>
                    x.includes(",") &&
                    x.replace(/,/g,"").length >= 5
                );


                if(nominalArray.length > 0){

                    nominal = "-" + nominalArray[0]
                    .replace(/,/g,"");

                }

            }





            // =========================
            // CARI NAMA REKENING
            // =========================


            let nama = "";

            let j = i + 2;



            while (j < lines.length) {



                if (lines[j].includes(",")) {


                    const arr = lines[j].split(",");

                    nama = arr[arr.length - 1].trim();

                    break;

                }



                if (
                    lines[j + 1] &&
                    lines[j + 1].startsWith("Withdraw")
                ) {

                    break;

                }



                j++;

            }




            if(nama && nominal){


                data.push({

                    nama,
                    userID,
                    nominal

                });


            }



            i = j;



        } else {


            i++;

        }



    }




    totalData.textContent = `${data.length} Data Berhasil`;




    data.forEach(item => {


        hasilExcel += `${item.nama}\t${item.userID}\n`;


        hasilNominal += `${item.nominal}\n`;



        preview.innerHTML += `

        <div class="item">

            <strong>${item.nama}</strong><br>

            ${item.userID}<br>

            ${item.nominal}

        </div>

        `;


    });



}





generate.addEventListener("click", prosesData);



input.addEventListener("input", () => {


    clearTimeout(window.delayParse);


    window.delayParse = setTimeout(() => {


        prosesData();


    },150);


});






copy.addEventListener("click", async () => {


    if(!hasilExcel){

        alert("Belum ada data.");
        return;

    }



    await navigator.clipboard.writeText(hasilExcel);


    copy.innerHTML="✅ COPIED";


    setTimeout(()=>{

        copy.innerHTML="COPY EXCEL";

    },1500);



});







copyNominal.addEventListener("click", async()=>{


    if(!hasilNominal){

        alert("Belum ada nominal.");
        return;

    }



    await navigator.clipboard.writeText(hasilNominal);



    copyNominal.innerHTML="✅ COPIED";



    setTimeout(()=>{

        copyNominal.innerHTML="COPY NOMINAL";

    },1500);



});