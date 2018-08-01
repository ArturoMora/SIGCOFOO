namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionCamposON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "Especialista", c => c.String(maxLength: 10));
            AddColumn("CR.tab_OportunidadNegocios", "Responsable", c => c.String(maxLength: 10));
            AddColumn("CR.tab_OportunidadNegocios", "Investigador", c => c.String(maxLength: 10));
            DropColumn("CR.tab_OportunidadNegocios", "AsignadoA");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_OportunidadNegocios", "AsignadoA", c => c.String(maxLength: 10));
            DropColumn("CR.tab_OportunidadNegocios", "Investigador");
            DropColumn("CR.tab_OportunidadNegocios", "Responsable");
            DropColumn("CR.tab_OportunidadNegocios", "Especialista");
        }
    }
}
