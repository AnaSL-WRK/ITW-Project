const btnsubmit = document.getElementById("1stform");
const inputed = document.getElementById("forminput");

var filtroBusca;
var baseUri = "";
var controleBusca = 0;
var tipo = 'title'
$("input").on("click", function () {
    filtroBusca = $("input:checked").val();
    console.log("Filtro de busca selecionado = " + filtroBusca);
    switch (filtroBusca) {
        case "filtro_Titulos":
            baseUri = 'http://192.168.160.58/netflix/api/Search/Titles?name=';
            break;
        case "filtro_Filmes":
            baseUri = 'http://192.168.160.58/netflix/api/Search/Movies?name=';
            break;
        case "filtro_Series":
            baseUri = 'http://192.168.160.58/netflix/api/Search/Series?name=';
            break;
        case "filtro_Categoria":
            baseUri = 'http://192.168.160.58/netflix/api/Search/Categories?name=';
            tipo = 'category';
            break;
        case "filtro_Paises":
            baseUri = 'http://192.168.160.58/netflix/api/Search/Countries?name=';
            tipo = 'country';
            break;
        case "filtro_Diretores":
            baseUri = 'http://192.168.160.58/netflix/api/Search/Directors?name=';
            tipo = 'director';
            break;
    }
    console.log("Base Uri = " + baseUri);
    return baseUri;
});

$.limparBusca = function () {
    $("#Name").empty();
    $("#Id").empty();
    $("#titleDetails").empty();
    controleBusca = 0;
    console.log("Busca limpa com sucesso");
};

btnsubmit.addEventListener("submit", function (e) {
    console.log(inputed.value);
    var inputedSearch = inputed.value;
    inputed.value.replace(/\s+/g, '');
    if (baseUri == "") {
        baseUri = 'http://192.168.160.58/netflix/api/Search/Titles?name=';
    }
    var composedUri = baseUri + inputedSearch;
    console.log("composed Uri = " + composedUri);
    if (controleBusca == 1) {
        $("#Name").empty();
        $("#Id").empty();
        $("#titleDetails").empty();
        $('#searchError1').hide();
        controleBusca = 0;
        console.log("Busca limpa com sucesso");
    }
    $(document).ready(function () {

        $.ajax({
            type: "GET",
            url: composedUri,
            data: {
                pagesize: 50,
            },
            success: function (data) {
                console.log("Data:" + data);
                console.log("Data Length: " + data.length);
                if (data.length == 0) {
                    console.log('Nenhum Titulo Encontrado');
                    $("#myModalSearch").modal({ backdrop: true });
                    $("#myModalSearch").modal("show");
                    $('#searchError1').show();
                } else {
                    $('#searchError1').hide();
                    $("#myModalSearch").modal({ backdrop: true });
                    $("#myModalSearch").modal("show");
                    $('#searchTable1').show();
                    $.each(data, function () {
                        $('#Name').append('<li style="list-style-type:none; height:30px">' + this['Name'] + '</li>');
                        $('#Id').append('<li style="list-style-type:none; height:30px">' + this['Id'] + '</li>');
                        var Id_GET = parseInt(this['Id']);
                        var baseUrl = './' + tipo + 'Details.html?id=';
                        console.log(baseUrl)
                        var urlDetails = baseUrl + Id_GET;
                        $('#titleDetails').append(`<li style="list-style-type:none; height:30px"><a href="${urlDetails}"><i class="fa fa-eye" style="color:floralwhite" title="Selecione para ver detalhes"></i></a>
                          </li>`
                        );
                    });
                    controleBusca = 1;
                    console.log("Valor do controleBusca = " + controleBusca);
                }

            },
        });

    });

    inputed.value = "";
    e.preventDefault();
});

