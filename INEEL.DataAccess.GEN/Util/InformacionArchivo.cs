using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public class InformacionArchivo
    {
        public string nombre { get; set; }
        public long tamano { get; set; }
        public string fullPath { get; set; }
        public string originalPath { get; set; }
        public int posicion { get; set; }
        public bool selected { get; set; }

        public void Dispose()
        {
            this.nombre = null;
            this.tamano = 0;
            this.fullPath = null;
            this.originalPath = null;
            this.posicion = 0;
            this.selected = false;
        }
    }
}