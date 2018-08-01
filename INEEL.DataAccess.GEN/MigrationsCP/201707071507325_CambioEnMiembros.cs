namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioEnMiembros : DbMigration
    {
        public override void Up()
        {
            AddColumn("CP.tab_Miembros", "nombrePersona", c => c.String(maxLength: 200));
            AlterColumn("CP.tab_Miembros", "idPersonas", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            AlterColumn("CP.tab_Miembros", "idPersonas", c => c.String());
            DropColumn("CP.tab_Miembros", "nombrePersona");
        }
    }
}
