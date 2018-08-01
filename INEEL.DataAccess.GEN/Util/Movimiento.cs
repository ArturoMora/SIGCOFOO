using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public enum Movimiento : byte
    {
        create,        // 0
        details, // 1
        edit, // 2
        cargado,   // 3
        validado,
        aprobado,
        gestionperfil,
        delete //si se requieren más, se deben agregar al final: NO SE DEBE MODIFICAR EL ORDEN QUE YA EXISTE

    }
}
