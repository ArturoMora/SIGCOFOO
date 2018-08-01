namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ampliaLongitudCampoTablaUnidadOrgEmpresas : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas");
            //DropForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            //DropIndex("GEN.Proyectos", new[] { "ClaveUnidadEmpresa" });
            //DropIndex("CR.cat_Contactos", new[] { "ClaveUnidad" });
            //DropPrimaryKey("CR.UnidadOrganizacionalEmpresas");
            //AlterColumn("GEN.Proyectos", "ClaveUnidadEmpresa", c => c.String(maxLength: 150));
            //AlterColumn("CR.cat_Contactos", "ClaveUnidad", c => c.String(maxLength: 150));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad", c => c.String(nullable: false, maxLength: 150));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "NombreUnidad", c => c.String(maxLength: 300));
            //AddPrimaryKey("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            //CreateIndex("GEN.Proyectos", "ClaveUnidadEmpresa");
            //CreateIndex("CR.cat_Contactos", "ClaveUnidad");
            //AddForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            //AddForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
        
        public override void Down()
        {
            //DropForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            //DropForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas");
            //DropIndex("CR.cat_Contactos", new[] { "ClaveUnidad" });
            //DropIndex("GEN.Proyectos", new[] { "ClaveUnidadEmpresa" });
            //DropPrimaryKey("CR.UnidadOrganizacionalEmpresas");
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "NombreUnidad", c => c.String(maxLength: 200));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad", c => c.String(nullable: false, maxLength: 20));
            //AlterColumn("CR.cat_Contactos", "ClaveUnidad", c => c.String(maxLength: 20));
            //AlterColumn("GEN.Proyectos", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            //AddPrimaryKey("CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            //CreateIndex("CR.cat_Contactos", "ClaveUnidad");
            //CreateIndex("GEN.Proyectos", "ClaveUnidadEmpresa");
            //AddForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            //AddForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
    }
}
