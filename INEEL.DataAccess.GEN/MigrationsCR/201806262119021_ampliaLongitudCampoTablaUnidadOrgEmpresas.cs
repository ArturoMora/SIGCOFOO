namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ampliaLongitudCampoTablaUnidadOrgEmpresas : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Iniciativas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropIndex("CR.cat_Contactos", new[] { "ClaveUnidad" });
            DropIndex("GEN.Propuestas", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Proyectos", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Iniciativas", new[] { "ClaveUnidadEmpresa" });
            DropPrimaryKey("CR.UnidadOrganizacionalEmpresas");
            AlterColumn("CR.cat_Contactos", "ClaveUnidad", c => c.String(maxLength: 150));
            AlterColumn("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad", c => c.String(nullable: false, maxLength: 150));
            AlterColumn("CR.UnidadOrganizacionalEmpresas", "NombreUnidad", c => c.String(maxLength: 300));
            AlterColumn("GEN.Propuestas", "ClaveUnidadEmpresa", c => c.String(maxLength: 150));
            AlterColumn("GEN.Proyectos", "ClaveUnidadEmpresa", c => c.String(maxLength: 150));
            AlterColumn("GEN.Iniciativas", "ClaveUnidadEmpresa", c => c.String(maxLength: 150));
            AddPrimaryKey("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            CreateIndex("CR.cat_Contactos", "ClaveUnidad");
            CreateIndex("GEN.Propuestas", "ClaveUnidadEmpresa");
            CreateIndex("GEN.Proyectos", "ClaveUnidadEmpresa");
            CreateIndex("GEN.Iniciativas", "ClaveUnidadEmpresa");
            AddForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("GEN.Iniciativas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.Iniciativas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas");
            DropIndex("GEN.Iniciativas", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Proyectos", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Propuestas", new[] { "ClaveUnidadEmpresa" });
            DropIndex("CR.cat_Contactos", new[] { "ClaveUnidad" });
            DropPrimaryKey("CR.UnidadOrganizacionalEmpresas");
            AlterColumn("GEN.Iniciativas", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            AlterColumn("GEN.Proyectos", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            AlterColumn("GEN.Propuestas", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            AlterColumn("CR.UnidadOrganizacionalEmpresas", "NombreUnidad", c => c.String(maxLength: 200));
            AlterColumn("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad", c => c.String(nullable: false, maxLength: 20));
            AlterColumn("CR.cat_Contactos", "ClaveUnidad", c => c.String(maxLength: 20));
            AddPrimaryKey("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            CreateIndex("GEN.Iniciativas", "ClaveUnidadEmpresa");
            CreateIndex("GEN.Proyectos", "ClaveUnidadEmpresa");
            CreateIndex("GEN.Propuestas", "ClaveUnidadEmpresa");
            CreateIndex("CR.cat_Contactos", "ClaveUnidad");
            AddForeignKey("GEN.Iniciativas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
    }
}
