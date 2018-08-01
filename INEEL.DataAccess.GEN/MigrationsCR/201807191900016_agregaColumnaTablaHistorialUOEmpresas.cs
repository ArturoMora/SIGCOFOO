namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaColumnaTablaHistorialUOEmpresas : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_HistorialUnidadesOrganizacionalesEmpresas", "nombreAnteriorUnidadPadre", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_HistorialUnidadesOrganizacionalesEmpresas", "nombreAnteriorUnidadPadre");
        }
    }
}
