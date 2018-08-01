using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class DataTableParameters
    {
        public int draw { get; set; }
        public int start { get; set; }
        public int length { get; set; }
        public order[] order { get; set; }
        public column[] columns { get; set; }
        public string nameColumns { get; set; }
        public Busqueda search { get; set; }
        public String names { get; set; }
        public String sortColumnDir { get; set; }
        public String searchValue { get { return search.value; } }
        public String sortColumn { get
            {
                int n = 0;
                try
                {
                    foreach (var item in order)
                    {
                        n = item.column;
                        sortColumnDir = item.dir;
                        break;
                    }
                }
                catch (Exception e) { }



                names = nameColumns;// httpR.Form.GetValues("nameColumns").FirstOrDefault();            
                String[] sortColumns = nameColumns.ToString().Trim().Split(';');
                return sortColumns[Convert.ToInt32(n)];

            } }

        public string palabras { get; set; }
        public string noPalabras { get; set; }
        public string NumjefeProyecto { get; set; }
        public string porContenido { get; set; }
        public string proyectoId { get; set; }
        public String EstadoFlujoId { get; set; }
        public String ClaveUnidad { get; set; }
        public String Autor { get; set; }
        public String Becario { get; set; }
        public String Titulo { get; set; }
        public String Capitulo { get; set; }
        public String Editorial { get; set; }
        public String Editor { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public String Tipo { get; set; }
        public String Institucion { get; set; }
        public DataTableParameters()
        {


            //filter parameter
            //searchValue = httpR.Form.GetValues("search[value]").FirstOrDefault();
            //pageSize = length > 0 ? length : 10;
            //skip = start > 0 ? start : 0;
            recordsTotal = 0;
            recordsFiltered = 0;
            //searchValue = search.value;
        }
        
        public int pageSize {
            get {return  length > 0 ? length : 10; }
            set { pageSize = value; }
        }
        public int skip { get { return start > 0 ? start : 0; } }
        public int recordsTotal { get; set; }
        public int recordsFiltered { get; set; }

    }

    //public class order
    //{
    //    public int column { get; set; }
    //    public string dir { get; set; }
    //}

    //public class column
    //{
    //    public string data { get; set; }
    //    public string name { get; set; }
    //    public bool searchable { get; set; }
    //    public bool orderable { get; set; }
    //    public search search { get; set; }
    //}

    //public class search
    //{
    //    public string value { get; set; }
    //    public bool regex { get; set; }
    //}
    //public class Busqueda
    //{
    //    public string value { get; set; }
    //}
}
