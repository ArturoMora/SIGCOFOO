namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCamposUnidadMarco : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "NombreTitular", c => c.String(maxLength: 100));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "Telefono", c => c.String(maxLength: 30));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "Ext", c => c.String(maxLength: 10));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "Celular", c => c.String(maxLength: 30));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "CP", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "CP", c => c.String(maxLength: 5));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "Celular", c => c.String(maxLength: 15));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "Ext", c => c.String(maxLength: 100));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "Telefono", c => c.String(maxLength: 15));
            //AlterColumn("CR.UnidadOrganizacionalEmpresas", "NombreTitular", c => c.String(maxLength: 50));
        }
    }
}
