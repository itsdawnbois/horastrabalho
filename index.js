$(document).ready(function() {
  $("#themeToggle").click(function() {
    const htmlElement = $("html");
    if (htmlElement.attr("data-bs-theme") === "dark") {
      htmlElement.removeAttr("data-bs-theme");
      $('label[for=themeToggle]').text('Alterar tema escuro')
    } else {
      htmlElement.attr("data-bs-theme", "dark");
      $('label[for=themeToggle]').text('Alterar tema claro')
    }
  });

  $("#tipoCalculo").change(function() {
    const tipoCalculo = $(this).val();
    if (tipoCalculo === "saida") {
      $("#saida").prop("disabled", true);
      $("#horasTrabalhadas").prop("disabled", false);
    } else if (tipoCalculo === "horasTrabalhadas") {
      $("#saida").prop("disabled", false);
      $("#horasTrabalhadas").prop("disabled", true);
    }
  });

  $("#declaracaoHoras").change(function() {
    if ($(this).is(":checked")) {
      $("#declaracaoHorasContainer").show();
    } else {
      $("#declaracaoHorasContainer").hide();
      $("#horasDeclaradasInicio").val("");
      $("#horasDeclaradasFim").val("");
    }
  });

  // Aplica a máscara de tempo (hh:mm) aos campos de entrada de tempo
  $('#entrada, #almoco, #retorno, #saida, #horasTrabalhadas, #horasDeclaradasInicio, #horasDeclaradasFim').mask('00:00');

  $("form").submit(function(event) {
    event.preventDefault();

    const entrada = $("#entrada").val();
    const almoco = $("#almoco").val();
    const retorno = $("#retorno").val();
    const saida = $("#saida").val();
    const tipoCalculo = $("#tipoCalculo").val();

    const declaracaoHorasAtiva = $("#declaracaoHoras").is(":checked");
    const entradaDeclarada = $("#horasDeclaradasInicio").val();
    const saidaDeclarada = $("#horasDeclaradasFim").val();

    let entradaHoras, entradaMinutos;
    let almocoHoras, almocoMinutos;
    let retornoHoras, retornoMinutos;
    let saidaHoras, saidaMinutos;
    let declaracaoHorasInicioHoras, declaracaoHorasInicioMinutos;

    if (declaracaoHorasAtiva) {
      if (!entradaDeclarada || !saidaDeclarada) {
        alert("Por favor, preencha as horas declaradas de início e fim.");
        return;
      }

      declaracaoHorasInicioHoras = parseInt(entradaDeclarada.split(":")[0], 10);
      declaracaoHorasInicioMinutos = parseInt(entradaDeclarada.split(":")[1], 10);
      declaracaoHorasFimHoras = parseInt(saidaDeclarada.split(":")[0], 10);
      declaracaoHorasFimMinutos = parseInt(saidaDeclarada.split(":")[1], 10);

      if (
        isNaN(declaracaoHorasInicioHoras) || isNaN(declaracaoHorasInicioMinutos) ||
        isNaN(declaracaoHorasFimHoras) || isNaN(declaracaoHorasFimMinutos) ||
        declaracaoHorasInicioHoras < 0 || declaracaoHorasInicioHoras > 23 || declaracaoHorasInicioMinutos < 0 || declaracaoHorasInicioMinutos > 59 ||
        declaracaoHorasFimHoras < 0 || declaracaoHorasFimHoras > 23 || declaracaoHorasFimMinutos < 0 || declaracaoHorasFimMinutos > 59
      ) {
        alert("Por favor, insira horários válidos para as horas declaradas no formato HH:mm.");
        return;
      }
    }
      

    // Validação básica dos campos de tempo
    if (!entrada || !almoco || !retorno) {
      alert("Por favor, preencha todos os horários.");
      return;
    }

    entradaHoras = parseInt(entrada.split(":")[0], 10);
    entradaMinutos = parseInt(entrada.split(":")[1], 10);
    almocoHoras = parseInt(almoco.split(":")[0], 10);
    almocoMinutos = parseInt(almoco.split(":")[1], 10);
    retornoHoras = parseInt(retorno.split(":")[0], 10);
    retornoMinutos = parseInt(retorno.split(":")[1], 10);
    saidaHoras = parseInt(saida.split(":")[0], 10);
    saidaMinutos = parseInt(saida.split(":")[1], 10);

    if (
      isNaN(entradaHoras) || isNaN(entradaMinutos) ||
      isNaN(almocoHoras) || isNaN(almocoMinutos) ||
      isNaN(retornoHoras) || isNaN(retornoMinutos) ||
      entradaHoras < 0 || entradaHoras > 23 || entradaMinutos < 0 || entradaMinutos > 59 ||
      almocoHoras < 0 || almocoHoras > 23 || almocoMinutos < 0 || almocoMinutos > 59 ||
      retornoHoras < 0 || retornoHoras > 23 || retornoMinutos < 0 || retornoMinutos > 59
    ) {
      alert("Por favor, insira horários válidos no formato HH:mm.");
      return;
    }

    // Datas devem vir com HH:mm
    const entradaDate = new Date(`1970-01-01T${entrada}:00`);
    const almocoDate = new Date(`1970-01-01T${almoco}:00`);
    const retornoDate = new Date(`1970-01-01T${retorno}:00`);
    const saidaDate = new Date(`1970-01-01T${saida}:00`);
    const declaracaoInicioDate = declaracaoHorasAtiva ? new Date(`1970-01-01T${entradaDeclarada}:00`) : null;
    const declaracaoFimDate = declaracaoHorasAtiva ? new Date(`1970-01-01T${saidaDeclarada}:00`) : null;

    if (entradaDate >= almocoDate || almocoDate >= retornoDate || (declaracaoHorasAtiva && (declaracaoInicioDate >= declaracaoFimDate))) {
      alert("Por favor, insira horários válidos.");
      return;
    }

    tempoDeclaradoMs = 0;
    if (declaracaoHorasAtiva) {
      tempoDeclaradoMs = declaracaoFimDate - declaracaoInicioDate;
    }

    if (tipoCalculo === "saida") {
      const horasTrabalhadasStr = $("#horasTrabalhadas").val();
      if (!horasTrabalhadasStr) {
        alert("Por favor, preencha as horas trabalhadas.");
        return;
      }
      var [horas, minutos] = horasTrabalhadasStr.split(":").map(Number);

      if (isNaN(minutos)) {
        minutos = 0;
      }

      const tempoAlmocoMs = retornoDate - almocoDate;

      // Horário de saida = Horário de entrada + Horas trabalhadas + Tempo de almoço - Tempo declarado (atestado médico)
      const totalTrabalhoMs = (horas * 3600000) + (minutos * 60000) + tempoAlmocoMs - tempoDeclaradoMs;
      const saidaCalculadaDate = new Date(entradaDate.getTime() + totalTrabalhoMs);

      const saidaHorasStr = String(saidaCalculadaDate.getHours()).padStart(2, "0");
      const saidaMinutosStr = String(saidaCalculadaDate.getMinutes()).padStart(2, "0");
      $("#saida").val(`${saidaHorasStr}:${saidaMinutosStr}`);
    } else if (tipoCalculo === "horasTrabalhadas") {
      if (!saida) {
        alert("Por favor, preencha o horário de saída.");
        return;
      }

      if (isNaN(saidaHoras) || isNaN(saidaMinutos) || saidaHoras < 0 || saidaHoras > 23 || saidaMinutos < 0 || saidaMinutos > 59) {
        alert("Por favor, insira um horário de saída válido no formato HH:mm.");
        return;
      }

      const totalTrabalhoMs = (saidaDate - entradaDate) - (retornoDate - almocoDate) + tempoDeclaradoMs;
      const horasTrabalhadas = Math.floor(totalTrabalhoMs / 3600000);
      const minutosTrabalhados = Math.floor((totalTrabalhoMs % 3600000) / 60000);

      const horasStr = String(horasTrabalhadas).padStart(2, "0");
      const minutosStr = String(minutosTrabalhados).padStart(2, "0");
      $("#horasTrabalhadas").val(`${horasStr}:${minutosStr}`);
    }
  });
});