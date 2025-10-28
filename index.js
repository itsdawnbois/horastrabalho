$(document).ready(function() {
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

  // Aplica a máscara de tempo (hh:mm) aos campos de entrada de tempo
  $('#entrada, #almoco, #retorno, #saida, #horasTrabalhadas').mask('00:00');

  $("form").submit(function(event) {
    event.preventDefault();

    const entrada = $("#entrada").val();
    const almoco = $("#almoco").val();
    const retorno = $("#retorno").val();
    const saida = $("#saida").val();
    const tipoCalculo = $("#tipoCalculo").val();

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

    if (entradaDate >= almocoDate || almocoDate >= retornoDate) {
      alert("Por favor, insira horários válidos.");
      return;
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

      // Horário de saida = Horário de entrada + Horas trabalhadas + Tempo de almoço
      const totalTrabalhoMs = (horas * 3600000) + (minutos * 60000) + tempoAlmocoMs;
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

      const totalTrabalhoMs = (saidaDate - entradaDate) - (retornoDate - almocoDate);
      const horasTrabalhadas = Math.floor(totalTrabalhoMs / 3600000);
      const minutosTrabalhados = Math.floor((totalTrabalhoMs % 3600000) / 60000);

      const horasStr = String(horasTrabalhadas).padStart(2, "0");
      const minutosStr = String(minutosTrabalhados).padStart(2, "0");
      $("#horasTrabalhadas").val(`${horasStr}:${minutosStr}`);
    }
  });
});