namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoestadoenmiembros : DbMigration
    {
        public override void Up()
        {
            AddColumn("CP.tab_Miembros", "estado", c => c.Boolean(nullable: false));
            AddColumn("CP.tab_Documento", "nombreDocumento", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("CP.tab_Documento", "nombreDocumento");
            DropColumn("CP.tab_Miembros", "estado");
        }
    }
}
