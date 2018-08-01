using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GEN.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public class CatalogoServiceProvider : ICatalogoServiceProvider
    {

        private GEN_Context db = new GEN_Context();

        //
        //  Obtiene una lista SelectListItem de Opciones según su identificador. El resultado se integra en los Select de los formularios.
        //  
        public List<SelectListItem> getOpcionesPorIdentificador(string identificador)
        {
            try
            {
                // Un catalogo debe estar disponible para usarse siempre y cuando no se encuentre En edición
                var catalogoId = (from c in db.Catalogo
                                  where c.ClaveIdCatalogo == identificador && c.estatus != "En edición"          // && c.estatus!="En edición" :: CREO QUE ESCTRICTAMENTE NO ES NECEARIO.
                                  select c.CatalogoId).SingleOrDefault();

                var opcionSelectList = (from o in db.Opcion
                                        where o.catalogoId == catalogoId
                                        select new SelectListItem
                                        {
                                            Text = o.etiqueta,
                                            Value = o.valor
                                        }).ToList();
                return opcionSelectList;
            }
            catch (Exception e)
            {
                Console.WriteLine("ERROR CatalogoServiceProvider.getOpcionesPorIdentificador(): " + e.Message);
                return null;
            }
        }

        //
        //Método que retorna la etiqueta correspondiente a un valor dado
        //
        public string getEtiquetaOpcion(string valor)
        {
            return (from o in db.Opcion where o.valor == valor select o.etiqueta).Single();
        }


        //
        //Método que retorna una lista de etiquetas de la opciones correpondientes al identificador.
        //
        public List<SelectListItem> getEtiquetaOpcionesPorIdentificador(string identificador)
        {
            try
            {
                var catalogoId = (from c in db.Catalogo where c.ClaveIdCatalogo == identificador select c.CatalogoId).Single();
                var opcionSelectList = (from o in db.Opcion
                                        where o.catalogoId == catalogoId
                                        select new SelectListItem
                                        {
                                            Value = o.etiqueta,
                                            Text = o.etiqueta
                                        }).ToList();
                return opcionSelectList;
            }
            catch (Exception e)
            {
                Console.WriteLine("ERROR CatalogoServiceProvider.getOpcionesPorIdentificador(): " + e.Message);
                return null;
            }
        }
    }
}