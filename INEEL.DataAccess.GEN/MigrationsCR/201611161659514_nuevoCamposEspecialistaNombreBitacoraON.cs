namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nuevoCamposEspecialistaNombreBitacoraON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_BitacoraON", "Especialista", c => c.String(maxLength: 500));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_BitacoraON", "Especialista");
        }
    }
}
