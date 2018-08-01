namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class williamEO : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_AccesoSistema",
                c => new
                    {
                        AccesoID = c.Int(nullable: false, identity: true),
                        ClaveAcceso = c.String(maxLength: 10),
                        UsuarioAcceso = c.String(maxLength: 10),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        ClaveUsuario_PersonaID = c.Int(),
                    })
                .PrimaryKey(t => t.AccesoID)
                .ForeignKey("GEN.cat_Personas", t => t.ClaveUsuario_PersonaID)
                .Index(t => t.ClaveUsuario_PersonaID);
            
            CreateTable(
                "GEN.cat_Personas",
                c => new
                    {
                        PersonaID = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(maxLength: 10),
                        RUPersona = c.String(maxLength: 20),
                        Nombre = c.String(maxLength: 100),
                        ApeMaterno = c.String(maxLength: 100),
                        ApePateno = c.String(maxLength: 100),
                        CveCategoria = c.String(maxLength: 10),
                        TipoPersonal = c.String(maxLength: 10),
                        Plaza = c.String(maxLength: 10),
                        ECorreo = c.String(maxLength: 20),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        CveUnidad_UnidadOId = c.Int(),
                        Localizacion_UbicacionAreaID = c.Int(),
                    })
                .PrimaryKey(t => t.PersonaID)
                .ForeignKey("GEN.cat_UnidadOrganizacional", t => t.CveUnidad_UnidadOId)
                .ForeignKey("GEN.tab_UbicacionAreas", t => t.Localizacion_UbicacionAreaID)
                .Index(t => t.CveUnidad_UnidadOId)
                .Index(t => t.Localizacion_UbicacionAreaID);
            
            CreateTable(
                "GEN.cat_UnidadOrganizacional",
                c => new
                    {
                        UnidadOId = c.Int(nullable: false, identity: true),
                        ClaveUnidad = c.String(maxLength: 5),
                        NombreUnidad = c.String(maxLength: 200),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        ClaveResponsable = c.String(),
                        ClaveUnidadPadre_UnidadOId = c.Int(),
                        Localizacion_UbicacionAreaID = c.Int(),
                        TipoUnidadO_TipoUnidadID = c.Int(),
                    })
                .PrimaryKey(t => t.UnidadOId)
                .ForeignKey("GEN.cat_UnidadOrganizacional", t => t.ClaveUnidadPadre_UnidadOId)
                .ForeignKey("GEN.tab_UbicacionAreas", t => t.Localizacion_UbicacionAreaID)
                .ForeignKey("GEN.cat_TipoUnidad", t => t.TipoUnidadO_TipoUnidadID)
                .Index(t => t.ClaveUnidadPadre_UnidadOId)
                .Index(t => t.Localizacion_UbicacionAreaID)
                .Index(t => t.TipoUnidadO_TipoUnidadID);
            
            CreateTable(
                "GEN.tab_UbicacionAreas",
                c => new
                    {
                        UbicacionAreaID = c.Int(nullable: false, identity: true),
                        NoEdificio = c.String(maxLength: 10),
                        NoPiso = c.String(maxLength: 10),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.UbicacionAreaID);
            
            CreateTable(
                "GEN.cat_TipoUnidad",
                c => new
                    {
                        TipoUnidadID = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 100),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TipoUnidadID);
            
            CreateTable(
                "GEN.cat_Funciones",
                c => new
                    {
                        FuncionesId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 255),
                        Funcion = c.String(maxLength: 100),
                        Url = c.String(maxLength: 255),
                        Nivel = c.Int(nullable: false),
                        Secuencia = c.Int(nullable: false),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        FuncionPadre_FuncionesId = c.Int(),
                        Modulo_ModuloId = c.String(maxLength: 3),
                    })
                .PrimaryKey(t => t.FuncionesId)
                .ForeignKey("GEN.cat_Funciones", t => t.FuncionPadre_FuncionesId)
                .ForeignKey("GEN.cat_Modulo", t => t.Modulo_ModuloId)
                .Index(t => t.FuncionPadre_FuncionesId)
                .Index(t => t.Modulo_ModuloId);
            
            CreateTable(
                "GEN.cat_FuncionesRol",
                c => new
                    {
                        FuncionesRolId = c.Int(nullable: false, identity: true),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        Funcion_FuncionesId = c.Int(),
                        Rol_RolId = c.Int(),
                    })
                .PrimaryKey(t => t.FuncionesRolId)
                .ForeignKey("GEN.cat_Funciones", t => t.Funcion_FuncionesId)
                .ForeignKey("GEN.cat_Roles", t => t.Rol_RolId)
                .Index(t => t.Funcion_FuncionesId)
                .Index(t => t.Rol_RolId);
            
            CreateTable(
                "GEN.cat_Roles",
                c => new
                    {
                        RolId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 100),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.RolId);
            
            CreateTable(
                "GEN.cat_RolPersona",
                c => new
                    {
                        RolPersonaId = c.Int(nullable: false, identity: true),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        Persona_PersonaID = c.Int(),
                        Rol_RolId = c.Int(),
                    })
                .PrimaryKey(t => t.RolPersonaId)
                .ForeignKey("GEN.cat_Personas", t => t.Persona_PersonaID)
                .ForeignKey("GEN.cat_Roles", t => t.Rol_RolId)
                .Index(t => t.Persona_PersonaID)
                .Index(t => t.Rol_RolId);
            
            AddColumn("GEN.cat_Modulo", "Estado", c => c.Int(nullable: false));
            AddColumn("GEN.cat_Modulo", "FechaEfectiva", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_RolPersona", "Rol_RolId", "GEN.cat_Roles");
            DropForeignKey("GEN.cat_RolPersona", "Persona_PersonaID", "GEN.cat_Personas");
            DropForeignKey("GEN.cat_FuncionesRol", "Rol_RolId", "GEN.cat_Roles");
            DropForeignKey("GEN.cat_FuncionesRol", "Funcion_FuncionesId", "GEN.cat_Funciones");
            DropForeignKey("GEN.cat_Funciones", "Modulo_ModuloId", "GEN.cat_Modulo");
            DropForeignKey("GEN.cat_Funciones", "FuncionPadre_FuncionesId", "GEN.cat_Funciones");
            DropForeignKey("GEN.tab_AccesoSistema", "ClaveUsuario_PersonaID", "GEN.cat_Personas");
            DropForeignKey("GEN.cat_Personas", "Localizacion_UbicacionAreaID", "GEN.tab_UbicacionAreas");
            DropForeignKey("GEN.cat_Personas", "CveUnidad_UnidadOId", "GEN.cat_UnidadOrganizacional");
            DropForeignKey("GEN.cat_UnidadOrganizacional", "TipoUnidadO_TipoUnidadID", "GEN.cat_TipoUnidad");
            DropForeignKey("GEN.cat_UnidadOrganizacional", "Localizacion_UbicacionAreaID", "GEN.tab_UbicacionAreas");
            DropForeignKey("GEN.cat_UnidadOrganizacional", "ClaveUnidadPadre_UnidadOId", "GEN.cat_UnidadOrganizacional");
            DropIndex("GEN.cat_RolPersona", new[] { "Rol_RolId" });
            DropIndex("GEN.cat_RolPersona", new[] { "Persona_PersonaID" });
            DropIndex("GEN.cat_FuncionesRol", new[] { "Rol_RolId" });
            DropIndex("GEN.cat_FuncionesRol", new[] { "Funcion_FuncionesId" });
            DropIndex("GEN.cat_Funciones", new[] { "Modulo_ModuloId" });
            DropIndex("GEN.cat_Funciones", new[] { "FuncionPadre_FuncionesId" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "TipoUnidadO_TipoUnidadID" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "Localizacion_UbicacionAreaID" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidadPadre_UnidadOId" });
            DropIndex("GEN.cat_Personas", new[] { "Localizacion_UbicacionAreaID" });
            DropIndex("GEN.cat_Personas", new[] { "CveUnidad_UnidadOId" });
            DropIndex("GEN.tab_AccesoSistema", new[] { "ClaveUsuario_PersonaID" });
            DropColumn("GEN.cat_Modulo", "FechaEfectiva");
            DropColumn("GEN.cat_Modulo", "Estado");
            DropTable("GEN.cat_RolPersona");
            DropTable("GEN.cat_Roles");
            DropTable("GEN.cat_FuncionesRol");
            DropTable("GEN.cat_Funciones");
            DropTable("GEN.cat_TipoUnidad");
            DropTable("GEN.tab_UbicacionAreas");
            DropTable("GEN.cat_UnidadOrganizacional");
            DropTable("GEN.cat_Personas");
            DropTable("GEN.tab_AccesoSistema");
        }
    }
}
