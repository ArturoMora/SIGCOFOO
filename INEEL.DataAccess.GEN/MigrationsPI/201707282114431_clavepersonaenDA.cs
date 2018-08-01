namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class clavepersonaenDA : DbMigration
    {
        public override void Up()
        {
            AddColumn("PI.tab_DerechosAutor", "ClavePersona", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            DropColumn("PI.tab_DerechosAutor", "ClavePersona");
        }
    }
}
