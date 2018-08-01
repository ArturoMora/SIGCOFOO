﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Repositories.PI;


namespace INEEL.WebAPI.Controllers.PI
{
    public class AutoresIndustrialExtController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutoresIndustrialExtController));
        AutoresIndustrialExtRepository _repository;
        public AutoresIndustrialExtController()
        {
            _repository = new AutoresIndustrialExtRepository();

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByPIExterno(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetByPIExterno(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(AutoresIndustrialExt Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
