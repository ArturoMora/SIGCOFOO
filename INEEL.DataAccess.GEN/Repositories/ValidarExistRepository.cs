using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class ValidarExistRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        CR_Context _crContext;
        private CP_Context _cpContext;
        public ValidarExistRepository()
        {
            _ctx = new SIGCOCHContext();
            _crContext= new CR_Context();
            _cpContext= new CP_Context();
        }

        public async Task<bool> Validar(ValidacionExist model)
        {
            try
            {
                var resultados = 0;
                switch (model.origen)
                {
                    case "idiomas":
                        if (model.excepcion == null)
                        {
                            //model.dato = model.dato.Replace("\r", "").Replace("\n", "").Replace(" ","");
                            resultados = await _ctx.Database.SqlQuery<String>
                           ("SELECT * FROM (SELECT replace(Descripcion,' ','')as Descripcion FROM CH.cat_Idioma) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                        ("SELECT * FROM (SELECT replace(Descripcion,' ','')as Descripcion FROM CH.cat_Idioma) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "pais":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                           ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Pais) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                          ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Pais) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "ambito":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                           ("SELECT * FROM (SELECT replace(Descripcion,' ','')as Descripcion FROM CH.cat_Ambito) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                          ("SELECT * FROM (SELECT replace(Descripcion,' ','')as Descripcion FROM CH.cat_Ambito) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "areasni":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                           ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_AreaSNI) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                          ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_AreaSNI) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "asistente":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                           ("SELECT ClavePersona FROM CH.cat_Asistentes where ClavePersona collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                          ("SELECT ClavePersona FROM CH.cat_Asistentes where ClavePersona collate Latin1_General_CI_AI = '" + model.dato + "' and ClavePersona collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "asociacion":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                           ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Asociacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                          ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Asociacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "becainterna":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
       ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_BecasInternas) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else {
                            resultados = await _ctx.Database.SqlQuery<String>
       ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_BecasInternas) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "campo":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Campos) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Campos) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "carrera":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Carreras) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Carreras) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "certificacion":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Certificacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Certificacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "disciplina":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Disciplinas) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Disciplinas) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "encargadoDespacho":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT ClavePersona FROM CH.cat_EncargadoDespacho where ClavePersona collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT ClavePersona FROM CH.cat_EncargadoDespacho where ClavePersona collate Latin1_General_CI_AI = '" + model.dato + "' and ClavePersona collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "estadopublicacion":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_EstadosPublicacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_EstadosPublicacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "evento":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Eventos) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Eventos) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "gradoacademico":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_GradoAcademico) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_GradoAcademico) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "instituto":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Instituciones) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_Instituciones) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "nivelcurso":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_NivelCurso) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_NivelCurso) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "nivelpublicacion":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_NivelPublicacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_NivelPublicacion) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "nvlsni":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_NivelSNI) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_NivelSNI) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "revista":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(RevistaNombre,' ','') as RevistaNombre FROM CH.cat_Revistas) t1 where RevistaNombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT * FROM (SELECT replace(RevistaNombre,' ','') as RevistaNombre FROM CH.cat_Revistas) t1 where RevistaNombre collate Latin1_General_CI_AI = '" + model.dato + "'and RevistaNombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "tipobeca":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_TipoBecas) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CH.cat_TipoBecas) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "congreso":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NombreCongreso,' ','') as NombreCongreso FROM CH.cat_Congresos) t1 where NombreCongreso collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            //("SELECT * FROM (SELECT replace(NombreCongreso,' ','') as NombreCongreso FROM CH.cat_Congresos) t1 where NombreCongreso collate Latin1_General_CI_AI = '" + model.dato + "' and NombreCongreso collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NombreCongreso,' ','') as NombreCongreso FROM CH.cat_Congresos) t1 where NombreCongreso collate Latin1_General_CI_AI = '" + model.dato + "'and NombreCongreso collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    //--------------Catálogo de MT-------------------
                    case "MT.tiposoftware":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT Nombre FROM MT.cat_TipoSoftware where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT Nombre FROM MT.cat_TipoSoftware where Nombre collate Latin1_General_CI_AI = '" + model.dato + "' and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "MT.tipocurso":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT Nombre FROM MT.cat_TipoCurso where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT Nombre FROM MT.cat_TipoCurso where Nombre collate Latin1_General_CI_AI = '" + model.dato + "' and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "MT.tipoinsumo":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT DescripcionInsumo FROM MT.TipoInsumo where DescripcionInsumo collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT DescripcionInsumo FROM MT.TipoInsumo where DescripcionInsumo collate Latin1_General_CI_AI = '" + model.dato + "' and DescripcionInsumo collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "MT.califCte":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT Nombre FROM MT.cat_CalificacionCliente where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT Nombre FROM MT.cat_CalificacionCliente where Nombre collate Latin1_General_CI_AI = '" + model.dato + "' and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "MT.califPer":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT Nombre FROM MT.cat_CalificacionPersonal where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT Nombre FROM MT.cat_CalificacionPersonal where Nombre collate Latin1_General_CI_AI = '" + model.dato + "' and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "MT.califResultadosF":
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT Nombre FROM MT.cat_CalifResultadosFinancieros where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT Nombre FROM MT.cat_CalifResultadosFinancieros where Nombre collate Latin1_General_CI_AI = '" + model.dato + "' and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "capacitacionYcertificacion":
                        //TODO: pendiente ajustar tablas
                        if (model.excepcion == null)
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                            ("SELECT Nombre FROM MT.cat_CalifResultadosFinancieros where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _ctx.Database.SqlQuery<String>
                              ("SELECT Nombre FROM MT.cat_CalifResultadosFinancieros where Nombre collate Latin1_General_CI_AI = '" + model.dato + "' and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0)
                         { return true; }
                            else
                            { return false; };
                        break;
                    
                    default:
                        throw new Exception("model.origen not found, debe indicar un model.origen VALIDO!");

                }
               

                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<bool> ValidarCR(ValidacionExist model)
        {
            try
            {
                int resultados = 0;
                switch (model.origen)
                {
                    case "Empresa":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NombreEmpresa,' ','') as NombreEmpresa FROM CR.cat_Empresas) t1 where NombreEmpresa collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NombreEmpresa,' ','') as NombreEmpresa FROM CR.cat_Empresas) t1 where NombreEmpresa collate Latin1_General_CI_AI = '" + model.dato + "'and NombreEmpresa collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;

                    case "TipoOrganizacion":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoOrganizacion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoOrganizacion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "AmbitoConvenio":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_AmbitoConv) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_AmbitoConv) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "AreaInvestigacion":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_AreaInvestigacion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_AreaInvestigacion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TipoRelacionEmpresa":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoRelacion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoRelacion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TipoProductoServicio":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoProductoServicio) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoProductoServicio) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TipoFuentesFinanciamiento":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoFuentesFinanciamiento) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoFuentesFinanciamiento) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "FuenteFinanciamiento":
                        if (model.excepcion == null)
                        {
                            resultados=await _crContext.Database.SqlQuery<String>
                                 ("SELECT * FROM (SELECT replace(NombreFF,' ','') as NombreFF FROM CR.tab_FuenteFinanciamiento) t1 where NombreFF collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NombreFF,' ','') as NombreFF FROM CR.tab_FuenteFinanciamiento) t1 where NombreFF collate Latin1_General_CI_AI = '" + model.dato + "'and NombreFF collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TipoConvenio":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NomTipConv,' ','') as NomTipConv FROM CR.cat_TipoConvenio) t1 where NomTipConv collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NomTipConv,' ','') as NomTipConv FROM CR.cat_TipoConvenio) t1 where NomTipConv collate Latin1_General_CI_AI = '" + model.dato + "'and NomTipConv collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "Tematicas":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                         ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_Tematicas) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_Tematicas) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TamanoEmpresa":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NomTamEmp,' ','') as NomTamEmp FROM CR.cat_TamanoEmpresa) t1 where NomTamEmp collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NomTamEmp,' ','') as NomTamEmp FROM CR.cat_TamanoEmpresa) t1 where NomTamEmp collate Latin1_General_CI_AI = '" + model.dato + "'and NomTamEmp collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "Servicio":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NomServ,' ','') as NomServ FROM CR.cat_Servicio) t1 where NomServ collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NomServ,' ','') as NomServ FROM CR.cat_Servicio) t1 where NomServ collate Latin1_General_CI_AI = '" + model.dato + "'and NomServ collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "SegmentoMercado":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NomSegMerc,' ','') as NomSegMerc FROM CR.cat_SegmentoMercado) t1 where NomSegMerc collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NomSegMerc,' ','') as NomSegMerc FROM CR.cat_SegmentoMercado) t1 where NomSegMerc collate Latin1_General_CI_AI = '" + model.dato + "'and NomSegMerc collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "Producto":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                         ("SELECT * FROM (SELECT replace(NomProd,' ','') as NomProd FROM CR.cat_Producto) t1 where NomProd collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                         
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NomProd,' ','') as NomProd FROM CR.cat_Producto) t1 where NomProd collate Latin1_General_CI_AI = '" + model.dato + "'and NomProd collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "NaturalezaInteraccion":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_NaturalezaInteraccion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_NaturalezaInteraccion) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "LineaDesarrolloTecnologico":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                               ("SELECT * FROM (SELECT replace(NomLinDesTec,' ','') as NomLinDesTec FROM CR.cat_LineaDesarrolloTecnologico) t1 where NomLinDesTec collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NomLinDesTec,' ','') as NomLinDesTec FROM CR.cat_LineaDesarrolloTecnologico) t1 where NomLinDesTec collate Latin1_General_CI_AI = '" + model.dato + "'and NomLinDesTec collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "Contactos":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                                  ("SELECT * FROM (SELECT replace(NombreContacto,' ','') as NombreContacto FROM CR.cat_Contactos) t1 where NombreContacto collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NombreContacto,' ','') as NombreContacto FROM CR.cat_Contactos) t1 where NombreContacto collate Latin1_General_CI_AI = '" + model.dato + "'and NombreContacto collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "CR.cat_ClavesEmpresas":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(ClaveEmpresa,' ','') as ClaveEmpresa FROM CR.cat_ClavesEmpresas) t1 where ClaveEmpresa collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                            
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(ClaveEmpresa,' ','') as ClaveEmpresa FROM CR.cat_ClavesEmpresas) t1 where ClaveEmpresa collate Latin1_General_CI_AI = '" + model.dato + "'and ClaveEmpresa collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TiposEventos":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                                  ("SELECT * FROM (SELECT replace(NombreEvento,' ','') as NombreEvento FROM CR.tab_TiposEventos) t1 where NombreEvento collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NombreEvento,' ','') as NombreEvento FROM CR.tab_TiposEventos) t1 where NombreEvento collate Latin1_General_CI_AI = '" + model.dato + "'and NombreEvento collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "Eventos":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                                  ("SELECT * FROM (SELECT replace(NombreEvento,' ','') as NombreEvento FROM CR.tab_Eventos) t1 where NombreEvento collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NombreEvento,' ','') as NombreEvento FROM CR.tab_Eventos) t1 where NombreEvento collate Latin1_General_CI_AI = '" + model.dato + "'and NombreEvento collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TituloPersona":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TituloPersona) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TituloPersona) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TipoAliado":
                        if (model.excepcion == null)
                        {
                            resultados = await _crContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoAliado) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _crContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CR.cat_TipoAliado) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    default:
                        throw new Exception("model.origen not found, debe indicar un model.origen VALIDO!");
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }

        public async Task<bool> ValidarCP(ValidacionExist model)
        {
            try
            {
                int resultados = 0;
                switch (model.origen)
                {

                    case "ComunidadCP":
                        if (model.excepcion == null)
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CP.tab_Comunidades) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Descripcion,' ','') as Descripcion FROM CP.tab_Comunidades) t1 where Descripcion collate Latin1_General_CI_AI = '" + model.dato + "'and Descripcion collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;

                    case "CategoriaCP":
                        if (model.excepcion == null)
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_CategoriaCP) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_CategoriaCP) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "CategoriaSitio":
                        if (model.excepcion == null)
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(NombreCategoria,' ','') as NombreCategoria FROM CP.cat_CategoriaSitio) t1 where NombreCategoria collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(NombreCategoria,' ','') as NombreCategoria FROM CP.cat_CategoriaSitio) t1 where NombreCategoria collate Latin1_General_CI_AI = '" + model.dato + "'and NombreCategoria collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "ListaOC":
                        if (model.excepcion == null)
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_ListaOC) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_ListaOC) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "RolesCP":
                        if (model.excepcion == null)
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_RolesCP) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_RolesCP) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TipoDocumento":
                        if (model.excepcion == null)
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_TipoDocumento) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_TipoDocumento) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                    case "TipoLineamiento":
                        if (model.excepcion == null)
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>
                            ("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_TipoLineamiento) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'").CountAsync();
                        }
                        else
                        {
                            resultados = await _cpContext.Database.SqlQuery<String>("SELECT * FROM (SELECT replace(Nombre,' ','') as Nombre FROM CP.cat_TipoLineamiento) t1 where Nombre collate Latin1_General_CI_AI = '" + model.dato + "'and Nombre collate Latin1_General_CI_AI != '" + model.excepcion + "'").CountAsync();
                        }
                        if (resultados > 0) { return true; } else { return false; };
                        break;
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }

        public async Task<bool> validarExistencia(ValidacionExist model)
        {
            try
            {
                SqlParameter param1 = new SqlParameter("@datoNuevo", model.datoNuevo.Replace("\r", "").Replace("\n", "").Replace(" ", ""));  //dato inicial a insertar
                SqlParameter param2 = new SqlParameter("@datoViejo", model.datoViejo.Replace("\r", "").Replace("\n", "").Replace(" ", ""));  //dato viejo
                SqlParameter param3 = new SqlParameter("@campoTabla", model.campoTabla);  //Campo por el cual se va a comparar
                SqlParameter param4 = new SqlParameter("@tabla", model.tabla);  //Esquema y tabla por la cual buscar
                

                var query = "EXEC [dbo].[SIGCO3_VALIDA_REGISTROS_DUPLICADOS] @datoNuevo, @datoViejo, @campoTabla, @tabla";
                
                var datos = await _ctx.Database.SqlQuery<object>(query, param1, param2, param3, param4).CountAsync();
                if (datos > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        }
}
