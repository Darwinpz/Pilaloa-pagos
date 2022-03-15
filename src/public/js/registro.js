$('.btn_ver_clave').click(function (e) {

    e.preventDefault();

    let $this = $(this);

    var padre = $this.prev('input');
    var hijo = $this[0].getElementsByTagName("i")[0];

    switch (padre.attr("type")) {

        case "text":

            padre.attr("type", "password");
            hijo.classList.add("fa-eye-slash");
            hijo.classList.remove("fa-eye")
            break

        case "password":
            padre.attr("type", "text");
            hijo.classList.add("fa-eye");
            hijo.classList.remove("fa-eye-slash")
            break;
    }

});