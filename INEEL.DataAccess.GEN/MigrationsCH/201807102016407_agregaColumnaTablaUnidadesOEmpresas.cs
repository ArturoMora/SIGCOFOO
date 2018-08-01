namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaColumnaTablaUnidadesOEmpresas : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.UnidadOrganizacionalEmpresas", "ContactoId", c => c.Int());
        }
        
        public override void Down()
        {
            //DropColumn("CR.UnidadOrganizacionalEmpresas", "ContactoId");
        }
    }
}
