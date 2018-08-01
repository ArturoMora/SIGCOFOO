namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevosCamposdeRegistroEventos : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Eventos", "ClaveEmpleado", c => c.String(maxLength: 250));
            AddColumn("CR.tab_Eventos", "RegistroEmpleado", c => c.String(maxLength: 250));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_Eventos", "RegistroEmpleado");
            DropColumn("CR.tab_Eventos", "ClaveEmpleado");
        }
    }
}
