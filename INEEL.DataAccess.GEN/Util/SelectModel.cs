using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace INEEL.DataAccess.GEN.Util
{
    public class SelectModel
    {
        public SelectModel()
        {

        }
        public SelectModel(String Clave, String Nombre)
        {
            this.Clave = Clave;
            this.Nombre = Nombre;
        }
        public String Clave { get; set; }
        public String Nombre { get; set; }        
    }
}