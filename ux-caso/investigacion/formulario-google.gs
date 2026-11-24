/**
 * Crea dos formularios en tu Google Drive: uno para choferes de reparto y otro para comercios que reciben mercadería.
 * Uso: https://script.google.com → Nuevo proyecto → pegá este código → elegí la función crearFormularios → Ejecutar
 * → aceptá los permisos. En «Registro de ejecución» aparecen los links para compartir y para editar.
 */
function crearFormularios() {
  const chofer = FormApp.create('Cómo es tu día de reparto');
  chofer.setDescription('Estoy diseñando una app para choferes de distribuidoras. Son 5 minutos, es anónimo y no hay respuestas correctas.');
  chofer.setProgressBar(true);
  chofer.addSectionHeaderItem().setTitle('Tu trabajo');
  chofer.addMultipleChoiceItem().setTitle('¿Hace cuánto hacés reparto?').setRequired(true)
    .setChoiceValues(['Menos de 1 año', '1 a 3 años', '3 a 10 años', 'Más de 10 años']);
  chofer.addMultipleChoiceItem().setTitle('¿Cuántas entregas hacés en un día normal?').setRequired(true)
    .setChoiceValues(['Menos de 10', '10 a 20', '20 a 40', 'Más de 40']);
  chofer.addMultipleChoiceItem().setTitle('¿Qué repartís?').setChoiceValues(['Almacén y bebidas', 'Lácteos o frescos', 'Paquetería', 'Materiales']).showOtherOption(true);
  chofer.addSectionHeaderItem().setTitle('Tu ruta');
  chofer.addCheckboxItem().setTitle('¿Cómo recibís la ruta del día?').setRequired(true)
    .setChoiceValues(['Lista en papel', 'Mensaje de WhatsApp', 'Una app de la empresa', 'La armo yo']).showOtherOption(true);
  chofer.addParagraphTextItem().setTitle('Contanos tu último día de reparto: desde que salís del depósito hasta que volvés.').setRequired(true);
  chofer.addCheckboxItem().setTitle('¿Qué te hace perder más tiempo?')
    .setChoiceValues(['Encontrar la dirección', 'Esperar que atiendan', 'Llamadas de clientes preguntando a qué hora llego', 'Contar bultos y firmar remitos', 'Comercio cerrado', 'Tránsito']).showOtherOption(true);
  chofer.addMultipleChoiceItem().setTitle('Cuando no podés entregar, ¿qué hacés?')
    .setChoiceValues(['Aviso por WhatsApp', 'Llamo a la oficina', 'Lo anoto en el remito', 'Nada, lo llevo de vuelta']).showOtherOption(true);
  chofer.addSectionHeaderItem().setTitle('El celular en el camión');
  chofer.addCheckboxItem().setTitle('¿Cómo usás el celular mientras repartís?')
    .setChoiceValues(['En el soporte del tablero', 'En la mano, caminando', 'Con guantes', 'Al sol, cuesta ver la pantalla', 'Casi no lo uso']);
  chofer.addScaleItem().setTitle('¿Qué tan cómodo te sentís usando apps en el celular?').setBounds(1, 5).setLabels('Nada', 'Muy cómodo').setRequired(true);
  chofer.addParagraphTextItem().setTitle('Si una app te ayudara con una sola cosa del reparto, ¿cuál sería?').setRequired(true);
  chofer.addTextItem().setTitle('Si querés probar la app más adelante (10 minutos), dejá un WhatsApp o mail. Es opcional.');

  const comercio = FormApp.create('Cómo recibís la mercadería en tu comercio');
  comercio.setDescription('Estoy diseñando una app para que los comercios sepan cuándo llega su pedido. Son 5 minutos, es anónimo.');
  comercio.setProgressBar(true);
  comercio.addMultipleChoiceItem().setTitle('¿Qué tipo de comercio tenés?').setRequired(true)
    .setChoiceValues(['Almacén o autoservicio', 'Kiosco', 'Bar o restaurante', 'Dietética o verdulería']).showOtherOption(true);
  comercio.addMultipleChoiceItem().setTitle('¿Cuántos pedidos de distribuidoras recibís por semana?').setRequired(true)
    .setChoiceValues(['1 a 3', '4 a 10', 'Más de 10']);
  comercio.addParagraphTextItem().setTitle('Contanos la última vez que esperaste un pedido: cómo supiste cuándo llegaba y qué pasó.').setRequired(true);
  comercio.addCheckboxItem().setTitle('¿Cómo sabés a qué hora llega el camión?').setRequired(true)
    .setChoiceValues(['Me avisan por WhatsApp', 'Llamo yo a la distribuidora', 'Viene siempre a la misma hora', 'No sé, espero']).showOtherOption(true);
  comercio.addScaleItem().setTitle('¿Qué tan seguido el pedido llega en un momento que te complica (mucha gente, local cerrado)?')
    .setBounds(1, 5).setLabels('Nunca', 'Siempre').setRequired(true);
  comercio.addCheckboxItem().setTitle('¿Qué te gustaría saber de tu pedido?')
    .setChoiceValues(['A qué hora llega', 'Cuántas entregas faltan antes de la mía', 'Un aviso unos minutos antes', 'Qué productos vienen', 'El comprobante firmado']).showOtherOption(true);
  comercio.addMultipleChoiceItem().setTitle('Si recibieras un aviso 10 minutos antes, ¿te serviría?')
    .setChoiceValues(['Sí, mucho', 'Algo', 'No']);
  comercio.addParagraphTextItem().setTitle('Si pudieras cambiar una sola cosa de cómo recibís los pedidos, ¿cuál sería?').setRequired(true);
  comercio.addTextItem().setTitle('Si querés probar la app más adelante (10 minutos), dejá un WhatsApp o mail. Es opcional.');

  Logger.log('CHOFERES — compartir: ' + chofer.getPublishedUrl() + '  editar: ' + chofer.getEditUrl());
  Logger.log('COMERCIOS — compartir: ' + comercio.getPublishedUrl() + '  editar: ' + comercio.getEditUrl());
}
