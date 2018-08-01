namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Actualizacion : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "CR.cat_Contactos",
            //    c => new
            //        {
            //            ContactoId = c.Int(nullable: false, identity: true),
            //            NombreContacto = c.String(maxLength: 200),
            //            ApellidoPaterno = c.String(maxLength: 200),
            //            ApellidoMaterno = c.String(maxLength: 200),
            //            AdjuntoId = c.Long(),
            //            Telefono = c.String(maxLength: 20),
            //            Celular = c.String(maxLength: 30),
            //            Extension = c.String(maxLength: 10),
            //            Correo = c.String(maxLength: 100),
            //            Direccion = c.String(maxLength: 200),
            //            RedFacebook = c.String(maxLength: 200),
            //            RedTwitter = c.String(maxLength: 200),
            //            RedLinkedin = c.String(maxLength: 200),
            //            FechaRegistro = c.DateTime(nullable: false),
            //            Autor = c.String(nullable: false, maxLength: 250),
            //            Estado = c.Boolean(nullable: false),
            //            ClaveUnidad = c.String(maxLength: 20),
            //            EmpresaId = c.Int(nullable: false),
            //            PaisId = c.Int(),
            //            EstadoId = c.Int(),
            //            MunicipioId = c.Int(),
            //            Edo = c.String(maxLength: 200),
            //            Munipio = c.String(maxLength: 200),
            //            Colonia = c.String(maxLength: 200),
            //            Calle = c.String(maxLength: 200),
            //            CP = c.String(maxLength: 5),
            //            Puesto = c.String(nullable: false, maxLength: 200),
            //        })
            //    .PrimaryKey(t => t.ContactoId)
            //    .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
            //    .ForeignKey("CR.cat_Empresas", t => t.EmpresaId, cascadeDelete: true)
            //    .ForeignKey("GEN.cat_Estados", t => t.EstadoId)
            //    .ForeignKey("GEN.cat_Municipios", t => t.MunicipioId)
            //    .ForeignKey("GEN.cat_Paises", t => t.PaisId)
            //    .ForeignKey("CR.UnidadOrganizacionalEmpresas", t => t.ClaveUnidad)
            //    .Index(t => t.AdjuntoId)
            //    .Index(t => t.ClaveUnidad)
            //    .Index(t => t.EmpresaId)
            //    .Index(t => t.PaisId)
            //    .Index(t => t.EstadoId)
            //    .Index(t => t.MunicipioId);
            
            //CreateTable(
            //    "CR.tab_ContactosPerfil",
            //    c => new
            //        {
            //            ContactoPerfilId = c.Int(nullable: false, identity: true),
            //            GradoAcademicoId = c.Int(nullable: false),
            //            CarreraId = c.Int(nullable: false),
            //            Especialidad = c.String(),
            //            InstitucionID = c.Int(nullable: false),
            //            PaisID = c.Int(nullable: false),
            //            FechaInicio = c.DateTime(nullable: false),
            //            FechaFinal = c.DateTime(nullable: false),
            //            ContactoId = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.ContactoPerfilId)
            //    .ForeignKey("CH.cat_Carreras", t => t.CarreraId, cascadeDelete: true)
            //    .ForeignKey("CR.cat_Contactos", t => t.ContactoId, cascadeDelete: true)
            //    .ForeignKey("CH.cat_GradoAcademico", t => t.GradoAcademicoId, cascadeDelete: true)
            //    .ForeignKey("CH.cat_Instituciones", t => t.InstitucionID, cascadeDelete: true)
            //    .ForeignKey("CH.cat_Pais", t => t.PaisID, cascadeDelete: true)
            //    .Index(t => t.GradoAcademicoId)
            //    .Index(t => t.CarreraId)
            //    .Index(t => t.InstitucionID)
            //    .Index(t => t.PaisID)
            //    .Index(t => t.ContactoId);
            
            //CreateTable(
            //    "CR.tab_ContactosPuesto",
            //    c => new
            //        {
            //            ContactoPuestoHistoricoId = c.Int(nullable: false, identity: true),
            //            Puesto = c.String(nullable: false),
            //            EmpresaId = c.Int(nullable: false),
            //            FechaInicio = c.DateTime(nullable: false),
            //            FechaFinal = c.DateTime(nullable: false),
            //            ContactoId = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.ContactoPuestoHistoricoId)
            //    .ForeignKey("CR.cat_Contactos", t => t.ContactoId, cascadeDelete: true)
            //    .ForeignKey("CR.cat_Empresas", t => t.EmpresaId, cascadeDelete: true)
            //    .Index(t => t.EmpresaId)
            //    .Index(t => t.ContactoId);
            
            //AddColumn("GEN.Proyectos", "ContactoId", c => c.Int());
            //CreateIndex("GEN.Proyectos", "ContactoId");
            //AddForeignKey("GEN.Proyectos", "ContactoId", "CR.cat_Contactos", "ContactoId");
        }
        
        public override void Down()
        {
            //DropForeignKey("GEN.Proyectos", "ContactoId", "CR.cat_Contactos");
            //DropForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas");
            //DropForeignKey("CR.cat_Contactos", "PaisId", "GEN.cat_Paises");
            //DropForeignKey("CR.cat_Contactos", "MunicipioId", "GEN.cat_Municipios");
            //DropForeignKey("CR.cat_Contactos", "EstadoId", "GEN.cat_Estados");
            //DropForeignKey("CR.cat_Contactos", "EmpresaId", "CR.cat_Empresas");
            //DropForeignKey("CR.tab_ContactosPuesto", "EmpresaId", "CR.cat_Empresas");
            //DropForeignKey("CR.tab_ContactosPuesto", "ContactoId", "CR.cat_Contactos");
            //DropForeignKey("CR.tab_ContactosPerfil", "PaisID", "CH.cat_Pais");
            //DropForeignKey("CR.tab_ContactosPerfil", "InstitucionID", "CH.cat_Instituciones");
            //DropForeignKey("CR.tab_ContactosPerfil", "GradoAcademicoId", "CH.cat_GradoAcademico");
            //DropForeignKey("CR.tab_ContactosPerfil", "ContactoId", "CR.cat_Contactos");
            //DropForeignKey("CR.tab_ContactosPerfil", "CarreraId", "CH.cat_Carreras");
            //DropForeignKey("CR.cat_Contactos", "AdjuntoId", "GEN.Adjunto");
            //DropIndex("CR.tab_ContactosPuesto", new[] { "ContactoId" });
            //DropIndex("CR.tab_ContactosPuesto", new[] { "EmpresaId" });
            //DropIndex("CR.tab_ContactosPerfil", new[] { "ContactoId" });
            //DropIndex("CR.tab_ContactosPerfil", new[] { "PaisID" });
            //DropIndex("CR.tab_ContactosPerfil", new[] { "InstitucionID" });
            //DropIndex("CR.tab_ContactosPerfil", new[] { "CarreraId" });
            //DropIndex("CR.tab_ContactosPerfil", new[] { "GradoAcademicoId" });
            //DropIndex("CR.cat_Contactos", new[] { "MunicipioId" });
            //DropIndex("CR.cat_Contactos", new[] { "EstadoId" });
            //DropIndex("CR.cat_Contactos", new[] { "PaisId" });
            //DropIndex("CR.cat_Contactos", new[] { "EmpresaId" });
            //DropIndex("CR.cat_Contactos", new[] { "ClaveUnidad" });
            //DropIndex("CR.cat_Contactos", new[] { "AdjuntoId" });
            //DropIndex("GEN.Proyectos", new[] { "ContactoId" });
            //DropColumn("GEN.Proyectos", "ContactoId");
            //DropTable("CR.tab_ContactosPuesto");
            //DropTable("CR.tab_ContactosPerfil");
            //DropTable("CR.cat_Contactos");
        }
    }
}
