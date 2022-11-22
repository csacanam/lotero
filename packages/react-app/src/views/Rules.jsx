import "./Rules.css";

export default function Rules() {
  return (
    <div id="lotero-rules">
      <ol>
        <li>
          Todo el dinero de las apuestas es recibido por un contrato inteligente al que no tiene
          acceso ningún usuario, ni siquiera los desarrolladores. Esto quiere decir, que los
          usuarios no entregan su dinero a una persona natural o jurídica, sino a un contrato
          inteligente que tiene unas reglas establecidas.
        </li>
        <li>
          5% del dinero apostado por los usuarios será enviado a la wallet de los desarrolladores.
          Ejemplo: si una persona apuesta 10 MATIC, 0.5 MATIC serán enviados a la wallet de los
          desarrolladores.
        </li>
        <li>
          5% de las recompensas de los ganadores se enviará a la wallet de los desarrolladores al
          momento de retirarlas. Ejemplo: si una persona retira 100 MATIC de sus recompensas, 5
          MATIC serán enviados a la wallet de los desarrolladores.
        </li>
        <li>
          Cuando no hay ganadores el dinero apostado se queda en el contrato para el pago de futuras
          recompensa.
        </li>
        <li>
          Cuando la recompensa de un usuario supera el dinero disponible en el contrato, el contrato
          adquiere una deuda con el usuario. Cada vez que ingrese dinero al contrato el usuario
          podrá retirar sus recompensas hasta que se le haya pagado en su totalidad.
        </li>
        <li>
          Si en un día específico no es posible obtener los resultados desde las fuentes externas,
          el dinero saldrá del contrato para que los usuarios reclamen su dinero. Debido a que al
          apostar se descontó el 5%, se devolverá el 95% del dinero apostado.
        </li>
      </ol>
    </div>
  );
}
