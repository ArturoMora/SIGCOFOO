namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migracion05 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_Personas", "CveCategoria", "GEN.cat_Categorias");
            DropForeignKey("GEN.cat_Personas", "TipoPersona", "GEN.cat_TipoPersona");
            DropForeignKey("GEN.cat_Personas", "IdUbicacion", "GEN.cat_UbicacionAreas");
            DropForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional");
            DropForeignKey("GEN.cat_UnidadOrganizacional", "TipoUnidadO_TipoUnidadID", "GEN.cat_TipoUnidad");
            DropForeignKey("GEN.cat_UnidadOrganizacional", "IdUbicacion", "GEN.cat_UbicacionAreas");
            DropForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional");
            DropForeignKey("GEN.tab_AccesoSistema", "ClavePersona", "GEN.cat_Personas");
            DropForeignKey("GEN.cat_FuncionesRol", "IdFuncion", "GEN.cat_Funciones");
            DropForeignKey("GEN.cat_FuncionesRol", "IdRol", "GEN.cat_Roles");
            DropForeignKey("GEN.cat_RolPersona", "ClavePersona", "GEN.cat_Personas");
            DropForeignKey("GEN.cat_RolPersona", "IdRol", "GEN.cat_Roles");
            DropIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona" });
            DropIndex("GEN.cat_Personas", new[] { "CveCategoria" });
            DropIndex("GEN.cat_Personas", new[] { "TipoPersona" });
            DropIndex("GEN.cat_Personas", new[] { "ClaveUnidad" });
            DropIndex("GEN.cat_Personas", new[] { "IdUbicacion" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "padre" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "IdUbicacion" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "TipoUnidadO_TipoUnidadID" });
            DropIndex("GEN.cat_FuncionesRol", new[] { "IdRol" });
            DropIndex("GEN.cat_FuncionesRol", new[] { "IdFuncion" });
            DropIndex("GEN.cat_RolPersona", new[] { "ClavePersona" });
            DropIndex("GEN.cat_RolPersona", new[] { "IdRol" });
            DropTable("GEN.tab_AccesoSistema");
            DropTable("GEN.cat_Personas");
            DropTable("GEN.cat_Categorias");
            DropTable("GEN.cat_TipoPersona");
            DropTable("GEN.cat_UbicacionAreas");
            DropTable("GEN.cat_UnidadOrganizacional");
            DropTable("GEN.cat_TipoUnidad");
            DropTable("GEN.cat_FuncionesRol");
            DropTable("GEN.cat_Roles");
            DropTable("GEN.cat_RolPersona");
        }
        
        public override void Down()
        {
            CreateTable(
                "GEN.cat_RolPersona",
                c => new
                    {
                        RolPersonaId = c.Int(nullable: false, identity: true),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        ClavePersona = c.String(maxLength: 128),
                        IdRol = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.RolPersonaId);
            
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
                "GEN.cat_FuncionesRol",
                c => new
                    {
                        FuncionesRolId = c.Int(nullable: false, identity: true),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        IdRol = c.Int(nullable: false),
                        IdFuncion = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.FuncionesRolId);
            
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
                "GEN.cat_UnidadOrganizacional",
                c => new
                    {
                        ClaveUnidad = c.String(nullable: false, maxLength: 128),
                        NombreUnidad = c.String(maxLength: 200),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        padre = c.String(maxLength: 128),
                        IdUbicacion = c.Int(nullable: false),
                        ClaveResponsable = c.String(),
                        TipoUnidadO_TipoUnidadID = c.Int(),
                    })
                .PrimaryKey(t => t.ClaveUnidad);
            
            CreateTable(
                "GEN.cat_UbicacionAreas",
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
                "GEN.cat_TipoPersona",
                c => new
                    {
                        TipoPersonaId = c.String(nullable: false, maxLength: 128),
                        Descripcion = c.String(maxLength: 100),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TipoPersonaId);
            
            CreateTable(
                "GEN.cat_Categorias",
                c => new
                    {
                        CategoriaId = c.String(nullable: false, maxLength: 128),
                        Descripcion = c.String(maxLength: 100),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CategoriaId);
            
            CreateTable(
                "GEN.cat_Personas",
                c => new
                    {
                        ClavePersona = c.String(nullable: false, maxLength: 128),
                        RUPersona = c.String(maxLength: 20),
                        Nombre = c.String(maxLength: 100),
                        ApellidoMaterno = c.String(maxLength: 100),
                        ApellidoPateno = c.String(maxLength: 100),
                        Plaza = c.String(maxLength: 10),
                        Correo = c.String(maxLength: 20),
                        ExperienciaPrevia = c.Single(nullable: false),
                        CveCategoria = c.String(maxLength: 128),
                        TipoPersona = c.String(maxLength: 128),
                        ClaveUnidad = c.String(maxLength: 128),
                        IdUbicacion = c.Int(nullable: false),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ClavePersona);
            
            CreateTable(
                "GEN.tab_AccesoSistema",
                c => new
                    {
                        AccesoID = c.Int(nullable: false, identity: true),
                        ClaveAcceso = c.String(maxLength: 10),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                        ClavePersona = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.AccesoID);
            
            CreateIndex("GEN.cat_RolPersona", "IdRol");
            CreateIndex("GEN.cat_RolPersona", "ClavePersona");
            CreateIndex("GEN.cat_FuncionesRol", "IdFuncion");
            CreateIndex("GEN.cat_FuncionesRol", "IdRol");
            CreateIndex("GEN.cat_UnidadOrganizacional", "TipoUnidadO_TipoUnidadID");
            CreateIndex("GEN.cat_UnidadOrganizacional", "IdUbicacion");
            CreateIndex("GEN.cat_UnidadOrganizacional", "padre");
            CreateIndex("GEN.cat_Personas", "IdUbicacion");
            CreateIndex("GEN.cat_Personas", "ClaveUnidad");
            CreateIndex("GEN.cat_Personas", "TipoPersona");
            CreateIndex("GEN.cat_Personas", "CveCategoria");
            CreateIndex("GEN.tab_AccesoSistema", "ClavePersona");
            AddForeignKey("GEN.cat_RolPersona", "IdRol", "GEN.cat_Roles", "RolId", cascadeDelete: true);
            AddForeignKey("GEN.cat_RolPersona", "ClavePersona", "GEN.cat_Personas", "ClavePersona");
            AddForeignKey("GEN.cat_FuncionesRol", "IdRol", "GEN.cat_Roles", "RolId", cascadeDelete: true);
            AddForeignKey("GEN.cat_FuncionesRol", "IdFuncion", "GEN.cat_Funciones", "FuncionesId", cascadeDelete: true);
            AddForeignKey("GEN.tab_AccesoSistema", "ClavePersona", "GEN.cat_Personas", "ClavePersona");
            AddForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            AddForeignKey("GEN.cat_UnidadOrganizacional", "IdUbicacion", "GEN.cat_UbicacionAreas", "UbicacionAreaID", cascadeDelete: true);
            AddForeignKey("GEN.cat_UnidadOrganizacional", "TipoUnidadO_TipoUnidadID", "GEN.cat_TipoUnidad", "TipoUnidadID");
            AddForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            AddForeignKey("GEN.cat_Personas", "IdUbicacion", "GEN.cat_UbicacionAreas", "UbicacionAreaID", cascadeDelete: true);
            AddForeignKey("GEN.cat_Personas", "TipoPersona", "GEN.cat_TipoPersona", "TipoPersonaId");
            AddForeignKey("GEN.cat_Personas", "CveCategoria", "GEN.cat_Categorias", "CategoriaId");
        }
    }
}
