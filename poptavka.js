Q;  // pro poptavka/poptavka.html view
// funkce volání ajaxu (protože obsahují templating {{..}}) jsou definovány ve view

var koefDPH = 1.21;

// inicializace cen
var neres_cenu = 8; // přeskoč výpočet ceny v n-1 inicializačních ajax voláních
var cena_lista=0;
var cena_lista2=0;
var sirka_lista=0;  // z kontroleru vráceno: šířka, zmenšená o hloubku falcu
var sirka_lista2=0; // dtto
var prorez=0;
var prorez2=0;
var cena_pasparta=0;
var cena_pasparta2=0;
var cena_okna=0;
var cena_okna2=0;
var cena_podklad=0;
var cena_podklad2=0;
var cena_sklo=0;
var cena_sklo2=0;
var cena_zaves=0;
var cena_ksmat=0;
var blintram_vzpery_po=0;
var blintram_vzpery_sirka_last=0;
var blintram_vzpery_vyska_last=0;
var platno_presah=0;
var plocha_platno=0;
var cena_blintram=0;
var cena_platno=0;

function rozmery() {
    var sirka = +$('#rp_sirka').val()||0;
    var vyska = +$('#rp_vyska').val()||0;
    var levy = +$('#rp_levy').val()||0;
    var horni = +$('#rp_horni').val()||0;
    var pravy = +$('#rp_pravy').val()||0;
    var dolni = +$('#rp_dolni').val()||0;
    $('#crozmer_sirka').text(sirka + levy + pravy);   
    $('#crozmer_vyska').text(vyska + horni + dolni);   
    return [sirka, vyska, levy, horni, pravy, dolni];
}

function blintram() {
    var blintram_vzpery_sirka = 0;
    var blintram_vzpery_vyska = 0;
    if (blintram_vzpery_po>0) {
        blintram_vzpery_sirka = Math.floor(
              (+$('#rp_vyska').val() - 1) / blintram_vzpery_po );
        blintram_vzpery_vyska = Math.floor(
              (+$('#rp_sirka').val() - 1) / blintram_vzpery_po );
    }
    if ((blintram_vzpery_sirka_last!=blintram_vzpery_sirka) ||
              (blintram_vzpery_vyska_last!=blintram_vzpery_vyska)) {
        if ((+$('#rp_blintram_vzper_sirka').val()==0) &&
            (+$('#rp_blintram_vzper_vyska').val()==0) ||
            confirm("Nově vypočtený počet vzpěr rámu:\nvodorovně: " +
                  blintram_vzpery_sirka + ', ' + "svisle: " +
                  blintram_vzpery_vyska + '\n\n' + "Změnit ?")) {
            $('#rp_blintram_vzper_sirka').val(blintram_vzpery_sirka);
            $('#rp_blintram_vzper_vyska').val(blintram_vzpery_vyska);
        }
        blintram_vzpery_sirka_last = blintram_vzpery_sirka;
        blintram_vzpery_vyska_last = blintram_vzpery_vyska;
    }
}

function cena() {
    /* při umístění do document.ready() nespočte cenu napoprvé */
    if (neres_cenu>0) {
        neres_cenu--;
        return;   // ignoruj nadbytečná úvodní ajaxová volání
    }
    var rozm = rozmery(); // [šíř,výš, lev,hor,pr,dol] a zobrazí celkový rozměr
    var sirka = rozm[0];
    var vyska = rozm[1];
    var levy = rozm[2];
    var horni = rozm[3];
    var pravy = rozm[4];
    var dolni = rozm[5];
    var obvod_vnitrni = +((sirka + vyska) / 50).toFixed(3);  // 50 = 2 * .. / 100
    var obvod_vnejsi = +((sirka + vyska + levy + horni + pravy + dolni) / 50
                        ).toFixed(3);
    var plocha_vnitrni = +(sirka*vyska*0.0001).toFixed(4);
    var sirka_cela = +((sirka+levy+pravy) / 100).toFixed(3);
    var vyska_cela = +((vyska+horni+dolni) / 100).toFixed(3);
    var plocha_vnejsi = +(sirka_cela*vyska_cela).toFixed(4);
    if (platno_presah>0) {
        plocha_platno = +((sirka_cela+platno_presah/50)*(vyska_cela+platno_presah/50)).toFixed(4);
    } else {
        plocha_platno = plocha_vnejsi;
    }
    var oken_navic = Math.max((+$('#rp_pasparta_oken').val()||1)-1, 0);
    var oken_navic2 = Math.max((+$('#rp_pasparta2_oken').val()||1)-1, 0);
    var zaves_ks = +$('#rp_zaves_ks').val()||1;
    var ksmat_ks = +$('#rp_ksmat_ks').val()||1;
    var vzper_sirka = +$('#rp_blintram_vzper_sirka').val()||0;
    var vzper_vyska = +$('#rp_blintram_vzper_vyska').val()||0;
    var spotreba_lista = (obvod_vnejsi + 8.0 * sirka_lista / 100.0) * (100.0 + prorez) / 100.0;
    var ccena_lista = cena_lista * spotreba_lista;
    var spotreba_lista2 = (obvod_vnejsi + 8.0 * sirka_lista2 / 100.0) * (100.0 + prorez2) / 100.0;
    var ccena_lista2 = cena_lista2 * spotreba_lista2;
    //alert([sirka, vyska, obvod_vnejsi, spotreba_lista, ccena_lista]);
    var cena_mat1 = ccena_lista +
                    ccena_lista2 +
                    cena_pasparta + cena_pasparta2 +
                    (cena_podklad + cena_podklad2)*plocha_vnejsi +
                    (cena_sklo + cena_sklo2)*plocha_vnejsi +
                    cena_blintram*
                      ((2+vzper_sirka)*sirka_cela + (2+vzper_vyska)*vyska_cela) +
                    cena_platno*plocha_platno +
                    cena_okna*oken_navic +
                    cena_okna2*oken_navic2 +
                    zaves_ks*cena_zaves +
                    ksmat_ks*cena_ksmat;
    $('#cena_mat1').text(cena_mat1.toFixed(2));
    var priplatek1 = parseFloat($('#rp_priplatek1').val() || 0) / koefDPH;
    var proc_label = '';
    var proc_procent = '';
    if (priplatek1 && cena_mat1) {
        proc_procent = parseInt(priplatek1 / cena_mat1 * 100.0).toString() + ' %';
        if (priplatek1>0) {
            proc_label = 'tj. příplatek';
        } else if (priplatek1<0) {
            proc_label = 'tj. sleva';
        }
    }
    $('#proc_label').text(proc_label);
    $('#proc_procent').text(proc_procent);
    var cena1 = cena_mat1 + priplatek1;
    $('#cena1').text(cena1.toFixed(0));
    var sdph = (cena1 * parseFloat($('#rp_ks').val()) * koefDPH).toFixed(0);
    var celkem = (Math.floor((sdph/koefDPH)*100)/100).toFixed(2);
    $('#sdph').text(sdph);
    $('#celkem').text(celkem);
    var dph = (sdph - celkem).toFixed(2);
    $('#dph').text(dph);
    $('#cena__container').removeClass('hidden').show();
    if (neres_cenu=0) {
        neres_cenu--;
        $('#cena__container').removeClass('hidden');  // zobraz cenu, jakmile ji poprvé známe
    }
          /*$('#xx').text(parseInt($('#xx').text())+1); ladění počtu spuštění*/
}

function pasparty() {
    var rozm = rozmery(); // [šíř,výš, lev,hor,pr,dol]
    var sirka_celkova = rozm[0]+rozm[2]+rozm[4];
    var vyska_celkova = rozm[1]+rozm[3]+rozm[5];
    var mensi = Math.min(sirka_celkova, vyska_celkova);
    var vetsi = Math.max(sirka_celkova, vyska_celkova);
    var pasparta1 = $('#rp_pasparta_cislo')[0];
    var pasparta2 = $('#rp_pasparta2_cislo')[0];
    var rozm1 = $.data(pasparta1, 'rozm'); //id,id,,;sirky,,;vysky,,;ceny,,
    var rozm2 = $.data(pasparta2, 'rozm');
    cena_pasparta = pasp_cena(rozm1, mensi, vetsi); 
    cena_pasparta2 = pasp_cena(rozm2, mensi, vetsi); 
}

function pasp_cena(rozm, mensi, vetsi) {
  //string "rozm" z ajaxu pasparta_get_more(), menší rozměr, větší rozměr
  //string "rozm": id,id,,;sirky,,;vysky,,;ceny,,
    if (!rozm) return 0.0;
    var plocha = mensi*vetsi;
    var casti = rozm.split(';'); // [0]id, [1]sirky, [2]vysky, [3]ceny
    /* nově volba rozměru tak, aby se vešla plošně */
    var sirky = casti[1].split(',');
    var vysky = casti[2].split(',');
    for (var i=0; i < Math.min(sirky.length, vysky.length); i++) {
        if (plocha<=sirky[i]*vysky[i]) break;
    }
    return parseFloat(casti[3].split(',')[i]); 

        /* původně volba rozměru tak, aby se vešla do obou rozměrů
        var i = Math.max(vejde_se(mensi, casti[1]), vejde_se(vetsi, casti[2]));
        function vejde_se(rozmer, rozmery) {
          //pořadí čísla v rozmery (r1,r2,..), do kterého se vejde rozmer
            var arozmery = rozmery.split(','); 
            for (var i=0; i < arozmery.length; i++) {
                if (rozmer<=arozmery[i]) break;
            }
            return i;
        }
        */
} 

$(document).ready(function() {
    $('#rp_sirka').focus();
    /* $('form:first *:input[type!=hidden]:first').focus();
       $('*:input:visible:enabled:first').focus();
       $("form:first *:input,select,textarea").filter(":not([readonly='readonly']):not([disabled='disabled']):not([type='hidden'])").first().focus(); */

    var priplatek='#priplatek_duvod, #priplatek_castka, #vysledna_cena, #priplatek_proc';
    if ($('#priplatek_castka').val()!=0) {$(priplatek).show()};
    $('#priplatek').click(function() {
        if ($('#rp_priplatek1').val()==0) {
            $(priplatek).slideToggle();
        } else {
            if (confirm('Stiskni OK pro odstranění příplatku (nebo slevy).')) {
                if ($('#rp_priplatek_duvod').val()!='') {
                    $('#rp_priplatek_duvod').val($('#rp_priplatek_duvod').val()+'\nPříplatek '+$('#rp_priplatek1').val()+' Kč byl zrušen.')
                }
                $('#rp_priplatek1').val(0);
                cena();
                $(priplatek).hide();
            } else {
                $(priplatek).show();
            }
        }
    });

    $('#rp_sirka, #rp_vyska').change(function() {
        if ($('#rp_sirka').val()>$('#rp_vyska').val()) {
            $('#orientace').fadeIn();
        } else {
            $('#orientace').fadeOut();
        }
    });

    $('#rp_levy').change(function() {
        if ($('#rp_levy').val()<=0) { 
            $('#rp_levy').val(0);
        }
        if ($('#rp_pravy').val()<=0) { 
            $('#rp_pravy').val(+$(this).val());
        }
        if ($('#rp_horni').val()<=0) { 
            $('#rp_horni').val(+$(this).val());
        }
        if ($('#rp_dolni').val()<=0) { 
            $('#rp_dolni').val(+$(this).val()+1.0);
        }
    });

    $('#rp_lista_cislo').change(function() {
        lista_cislo_change();
    });
    $('#rp_lista2_cislo').change(function() {
        lista2_cislo_change();
    });

    $('#rp_pasparta_cislo').change(function() {
        pasparta_cislo_change();
    });
    $('#rp_pasparta2_cislo').change(function() {
        pasparta2_cislo_change();
    });
  /*
    $('#rp_pasparta_id').change(function() {
        pasparta_id_change();
    });
    $('#rp_pasparta2_id').change(function() {
        pasparta2_id_change();
    });
  */
  
    $('#rp_podklad_id').change(function () {
        podklad_change();
    });
    $('#rp_podklad2_id').change(function () {
        podklad2_change();
    });
  
    $('#rp_sklo_id').change(function () {
        sklo_change();
    });
    $('#rp_sklo2_id').change(function () {
        sklo2_change();
    });
  
    $('#rp_blintram_id').change(function () {
        blintram_change();
    });
    $('#rp_platno_id').change(function () {
        platno_change();
    });

    $('#rp_zaves_id').change(function () {
        zaves_change();
    });
    $('#rp_ksmat_id').change(function () {
        ksmat_change();
    });
  
    lista_cislo_change(); 
    lista2_cislo_change(); 
    pasparta_cislo_change();
    pasparta2_cislo_change();
    //pasparta_id_change();
    //pasparta2_id_change();
    podklad_change();
    podklad2_change();
    sklo_change(); 
    sklo2_change(); 
    blintram_change();
    platno_change();
    zaves_change();
    ksmat_change();
  
    $('.rozmer').change(function() {
        blintram();
    });
    $('.paspa').change(function() {
        pasparty();
    });
    $('input').change(function() {
        cena();
    });
    
    /* časem možná zkusit toto úplně vyhodit, protože se při inicializaci
        zřejmě vždy volá opakovaně */
    pasparty(); /* určení ceny a barev pasparty */
    cena(); /* jistota; ale zavolá se vícekrát přes ajax, např. u lišty */
  
    /* automaticky přizpůsobovat výšku textarea; v kombinaci s style overflow:hidden */
    function textAreaAdjust(o) {
        o.style.height = "1px";
        o.style.height = (o.scrollHeight)+"px"; /* lze (o.scrollHeight+/-nnn) */
    }
    $('div.detail textarea').keyup(function() {
        textAreaAdjust(this);
    });
  
    $('.druhak').click(function() {
        $(this).parent().parent().parent().children('div.grp2').show();
        $(this).hide();
        return false;
    });

    $('.blintram__ukaz_a').click(function() {
        $('#blintram_skryty').show();
        $(this).parent().hide();
        return false;
    });
  
    $('.poznamka_dil').click(function() {
        var detail = $(this).parent().parent().children('div.detail');
        var txt = detail.children('textarea');
        if (detail.css('display')=='none') {
            detail.show(); /* .slideUp trhalo s obrazem */
            detail.children('textarea').focus();
        } else if (!txt.val()) {
            detail.slideUp();
        } else if (confirm('Pomocí OK smažeš text poznámky.')) {
            txt.val(null);
            detail.slideUp();
        }
        return false;
    });
  
    function show_poznamka(o){
        if (o.val()) {
            o.parent().show();
            o.height((14*o.val().match(/\n?[^\n]{1,80}|\n/g).length)+'px');
        }
    }
  
    show_poznamka($('#rp_lista_poznamka'));
    show_poznamka($('#rp_lista2_poznamka'));
    show_poznamka($('#rp_pasparta_poznamka'));
    show_poznamka($('#rp_pasparta2_poznamka'));
    show_poznamka($('#rp_podklad_poznamka'));
    show_poznamka($('#rp_podklad2_poznamka'));
    show_poznamka($('#rp_sklo_poznamka'));
    show_poznamka($('#rp_sklo2_poznamka'));
    show_poznamka($('#rp_poznamka'));
  
    function show_grp2(o,p) {
        if (o.val()||p.val()) {
            o.parent().parent().show();
        }
    }
  
    show_grp2($('#rp_lista2_cislo'), $('#rp_lista2_poznamka'));
    show_grp2($('#rp_pasparta2_cislo'), $('#rp_pasparta2_poznamka'));
    show_grp2($('#rp_podklad2_id'), $('#rp_podklad2_poznamka'));
    show_grp2($('#rp_sklo2_id'), $('#rp_sklo2_poznamka'));
});
